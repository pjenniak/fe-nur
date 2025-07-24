import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/ui/layout/dashboard-layout";
import { api } from "@/config/api";
import formatRupiah from "@/helper/formatRupiah";
import { useEffect, useState, useRef } from "react";
import {
  AiOutlineDollar,
  AiOutlineShopping,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { MdOutlineTableChart } from "react-icons/md";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  PieController,
  ArcElement,
  CategoryScale,
  Tooltip,
} from "chart.js";
import { PLACEHOLDER } from "@/constant/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Registering chart.js components
ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  PieController,
  ArcElement,
  CategoryScale,
  Tooltip
);

// Define an array of colors to cycle through for the pie chart
const colorPalette = [
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(255, 205, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
];

const getColor = (index) => colorPalette[index % colorPalette.length];

// Setup the chart.js data for Line chart (Financial Data)
const getFinancialChartData = (data) => {
  if (!data) {
    return { datasets: [], labels: [] };
  }
  return {
    labels: data?.chart?.map((item) => item?.date),
    datasets: [
      {
        label: "Omzet",
        data: Object.values(data.chart).map((item) => Number(item.omzet)),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
        tension: 0.4, // Added smooth lines
      },
      {
        label: "Profit",
        data: Object.values(data.chart).map((item) => Number(item.profit)),
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
        tension: 0.4, // Added smooth lines
      },
      {
        label: "Pengeluaran",
        data: Object.values(data.chart).map((item) => Number(item.pengeluaran)),
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
        tension: 0.4, // Added smooth lines
      },
    ],
  };
};

// Doughnut chart for product ratios
const getProductDoughnutChartData = (data) => {
  if (!data) return { datasets: [], labels: [] };

  const labels = data.ratio.map(
    (r) => `${r.nama} ${r.total_terjual} (${r.rasio.toFixed(2)}%)`
  );
  const dataset = data.ratio.map((r) => r.total_terjual);

  // Use the color palette for the doughnut chart segments
  const backgroundColors = dataset.map(
    (_, index) => colorPalette[index % colorPalette.length]
  );

  return {
    labels,
    datasets: [
      {
        label: "Perbandingan Penjualan Produk",
        data: dataset,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };
};

const RingkasanPage = () => {
  const { data, setType, type } = useRingkasan();

  // Use ref for accessing DOM elements directly
  const financeChartRef = useRef(null);
  const productChartRef = useRef(null);

  // Handle chart creation and destruction
  useEffect(() => {
    if (!data) return;

    // Destroy the previous chart instances if any
    const financeCanvas = financeChartRef?.current;
    const productCanvas = productChartRef?.current;

    const financeChart = new ChartJS(financeCanvas, {
      type: "line",
      data: getFinancialChartData(data),
      options: {
        plugins: {
          title: {
            display: true,
            text: "Grafik Keuangan",
          },
          legend: {
            display: true, // Display legend
            position: "top", // Positioning the legend
          },
          tooltip: {
            enabled: true, // Enabling tooltips for more info on hover
            callbacks: {
              // Custom tooltip callback
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${formatRupiah(
                  tooltipItem?.raw || 0
                )}`;
              },
            },
          },
        },
        scales: {
          x: {
            type: "category", // Change to category for better axis handling
            title: {
              display: true,
              text: "Tanggal",
            },
          },
          y: {
            type: "linear",
            title: {
              display: true,
              text: "Jumlah",
            },
          },
        },
        hover: {
          mode: "index",
          axis: "x",
          includeInvisible: true,
          intersect: false,
        },
      },
    });

    const productChart = new ChartJS(productCanvas, {
      type: "doughnut",
      data: getProductDoughnutChartData(data),
      options: {
        plugins: {
          title: {
            display: true,
            text: "Perbandingan Produk",
          },
          legend: {
            display: true, // Display legend
            position: "top", // Positioning the legend
          },
          tooltip: {
            enabled: true, // Enabling tooltips for more info on hover
            callbacks: {
              // Custom tooltip callback
              label: function (tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw}%`;
              },
            },
          },
        },
      },
    });

    return () => {
      // Cleanup the chart instances when the component unmounts or updates
      financeChart.destroy();
      productChart.destroy();
    };
  }, [data]);

  return (
    <DashboardLayout
      title="Ringkasan"
      childredHeader={
        <div className="flex flex-col gap-2 bg-white">
          <Label>Rentang Waktu</Label>
          <Select onValueChange={(val) => setType(val)} value={type}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Filter" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Semua",
                "Bulanan",
                "Tahunan",
                "7 Hari Terakhir",
                "30 Hari Terakhir",
                "365 Hari Terakhir",
              ].map((item) => (
                <SelectItem value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full items-stretch">
        {/* Charts Section */}
        <div className="border border-gray-300 bg-white rounded-xl flex flex-col gap-4 px-4 py-4 col-span-1 md:col-span-2 xl:col-span-2">
          <h2 className="text-2xl font-semibold">Analisa Keuangan</h2>

          <div className="w-full">
            {/* Use the ref for the canvas elements */}
            <canvas ref={financeChartRef}></canvas>
            <div className="flex flex-row w-full flex-wrap gap-4 mt-2">
              <div className="flex flex-row gap-2">
                <div
                  className="rounded-sm w-4 h-4"
                  style={{ backgroundColor: "rgba(75, 192, 192, 1)" }}
                />
                <Label>Omzet</Label>
              </div>
              <div className="flex flex-row gap-2">
                <div
                  className="rounded-sm w-4 h-4"
                  style={{ backgroundColor: "rgba(153, 102, 255, 1)" }}
                />
                <Label>Profit</Label>
              </div>
              <div className="flex flex-row gap-2">
                <div
                  className="rounded-sm w-4 h-4"
                  style={{ backgroundColor: "rgba(255, 99, 132, 1)" }}
                />
                <Label>Pengeluaran</Label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <Label>Total Penjualan</Label>
                  <AiOutlineShopping className="text-lg" />
                </div>
                <p className="text-2xl font-medium">
                  {data?.master?.total_produk_terjual || 0}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <Label>Total Pembelian</Label>
                  <AiOutlineShoppingCart className="text-lg" />
                </div>
                <p className="text-2xl font-medium">
                  {data?.master?.total_pembelian_produk || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview Section */}
        <div className="border border-gray-300 bg-white rounded-xl flex flex-col gap-4 px-4 py-4 col-span-1 md:col-span-2 xl:col-span-1">
          <h2 className="text-2xl font-semibold">Produk Terlaris</h2>
          <div className="flex flex-col gap-4 overflow-scroll h-full">
            {data?.sold?.length > 0 ? (
              data?.sold?.map((item) => (
                <div
                  key={item.produk_id}
                  className="flex flex-row gap-2 items-center"
                >
                  <img
                    src={item.gambar || PLACEHOLDER}
                    alt={item.nama}
                    className="w-12 h-12 min-w-12 min-h-12 object-cover rounded-lg"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium line-clamp-1">
                      {item.nama}
                    </p>
                    <p className="text-xs line-clamp-1">
                      Total Terjual: {item.total_terjual}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-600">
                Tidak ada produk terjual pada rentang ini
              </div>
            )}
          </div>
        </div>

        {/* Master Data Section */}
        <div className="border border-gray-300 bg-white rounded-xl flex flex-col gap-4 px-4 py-4 col-span-1 md:col-span-2 xl:col-span-1">
          <h2 className="text-2xl font-semibold">Keuangan</h2>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <Label>Omzet</Label>
                <MdOutlineTableChart className="text-lg" />
              </div>
              <p className="text-3xl font-medium">
                {formatRupiah(Number(data?.master?.omzet || 0))}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <Label>Pengeluaran</Label>
                <AiOutlineShoppingCart className="text-lg" />
              </div>
              <p className="text-xl font-medium">
                {formatRupiah(Number(data?.master?.pengeluaran || 0))}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <Label>Profit</Label>
                <AiOutlineDollar className="text-lg" />
              </div>
              <p className="text-xl font-medium">
                {formatRupiah(Number(data?.master?.profit || 0))}
              </p>
            </div>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="border border-gray-300 bg-white rounded-xl flex flex-col gap-4 px-4 py-4 col-span-1 md:col-span-2 xl:col-span-2">
          <h2 className="text-2xl font-semibold">Rasio Penjualan Produk</h2>
          <div className="w-full flex flex-col md:flex-row gap-4 items-center">
            {getProductDoughnutChartData(data).labels.length ? (
              <canvas
                ref={productChartRef}
                className="w-64 h-64 max-w-64 max-h-64 min-w-64 min-h-64
              
              md:w-64 md:h-64 md:max-w-64 md:max-h-64 md:min-w-64 md:min-h-64
              
              lg:w-80 lg:h-80 lg:max-w-80 lg:max-h-80 lg:min-w-80 lg:min-h-80
              
              xl:w-96 xl:h-96 xl:max-w-96 xl:max-h-96 xl:min-w-96 xl:min-h-96
              "
              ></canvas>
            ) : (
              <div className="text-sm text-gray-600">
                Tidak ada produk terjual pada rentang ini
              </div>
            )}

            <div className="flex flex-col gap-2">
              {getProductDoughnutChartData(data)?.labels?.length
                ? getProductDoughnutChartData(data)?.labels?.map((_, index) => (
                    <div
                      key={index}
                      className="flex flex-row gap-2 items-center"
                    >
                      <div
                        className="w-4 h-4 min-w-4 min-h-4 rounded-sm"
                        style={{
                          backgroundColor: getColor(index),
                        }}
                      ></div>
                      <p className="text-sm">
                        {getProductDoughnutChartData(data)?.labels?.[index]}
                      </p>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const useRingkasan = () => {
  const [data, setData] = useState();
  const [type, setType] = useState("Semua");

  const fetchData = async () => {
    try {
      const response = await api.get(`/ringkasan`, {
        params: {
          type,
        },
      });
      console.log(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  return { data, type, setType };
};

export default RingkasanPage;
