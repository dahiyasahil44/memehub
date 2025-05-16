
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dehamh3j6/image/upload";
const UPLOAD_PRESET = "memory-lane";

export async function uploadToCloudinary(file) {
  if (!file) throw new Error("No file provided for upload");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error("Upload failed");
  }

  return data.secure_url;
}
