import os

# Tentukan direktori sumber
src_dir = "src"

# Fungsi untuk mengganti ekstensi file secara rekursif
def rename_files_in_directory(directory):
    for root, dirs, files in os.walk(directory):
        for filename in files:
            # Tentukan path lengkap file
            file_path = os.path.join(root, filename)
            
            # Ubah ekstensi .tsx menjadi .jsx
            if filename.endswith('.tsx'):
                new_filename = filename.replace('.tsx', '.jsx')
                new_file_path = os.path.join(root, new_filename)
                os.rename(file_path, new_file_path)
                print(f"File '{file_path}' diubah menjadi '{new_file_path}'")
            
            # Ubah ekstensi .ts menjadi .js
            elif filename.endswith('.ts'):
                new_filename = filename.replace('.ts', '.js')
                new_file_path = os.path.join(root, new_filename)
                os.rename(file_path, new_file_path)
                print(f"File '{file_path}' diubah menjadi '{new_file_path}'")

# Panggil fungsi untuk mengganti nama file di direktori src dan sub-direktorinya
rename_files_in_directory(src_dir)
