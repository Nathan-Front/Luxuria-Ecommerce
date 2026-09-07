import { GOOGLE_APPS_SCRIPT_URL } from "../../script/index.js";
export function avatarUpload() {
  const avatarInput = document.getElementById("avatarUpload");
  const profilePic = document.getElementById("user-avatar");
  avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0]; //get only one image
    if (!file) return;
    //check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    //immediately display selected image
    const previewURL = URL.createObjectURL(file);
    profilePic.src = previewURL;

    const reader = new FileReader();
    try {
      reader.onload = async () => {
        const imageData = reader.result;
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({
            formType: "upload-avatar",
            email: JSON.parse(localStorage.getItem("loggedIn")).email,
            image: imageData,
            fileName: file.name,
            mimeType: file.type,
          }),
        });
        if (!response.ok) {
          alert("Failed to upload image. Please try again.");
          return;
        }
        const result = await response.json();
        console.log("Upload result:", result);
        if (result.success) {
          alert(result.message);
          /*           const profilePic = document.getElementById("user-avatar");
          profilePic.src = imageData; //update the profile picture */
          const userData = JSON.parse(localStorage.getItem("loggedIn"));
          userData.avatar = result.fileId;
          localStorage.setItem("loggedIn", JSON.stringify(userData));
        } else {
          alert("Failed to upload image. Please try again.");
        }
      };
    } catch (error) {
      console.error("Error reading file:", error);
      alert("An error occurred while reading the file. Please try again.");
      return;
    }
    reader.readAsDataURL(file); //open the file and convert it to string
  });
}
