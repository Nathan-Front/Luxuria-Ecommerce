import {
  GOOGLE_APPS_SCRIPT_URL,
  showSpinner,
  hideSpinner,
} from "../../script/index.js";
import { languages } from "../../script/translation.js";
import { openGlobalAuth, hideGlobalAuth } from "../../script/globalAuth.js";

export function avatarUpload() {
  const avatarInput = document.getElementById("avatarUpload");
  const profilePic = document.getElementById("user-avatar");

  avatarInput.addEventListener("change", () => {
    const changeLanguage = localStorage.getItem("language") || "en";
    const file = avatarInput.files[0]; //get only one image
    if (!file) return;
    //check if file is an image
    if (!file.type.startsWith("image/")) {
      alert(
        `${changeLanguage === "en" ? languages.en.wrongFormatText : languages.ja.wrongFormatText}`,
      );
      return;
    }
    const reader = new FileReader();

    try {
      reader.onload = async () => {
        openGlobalAuth();
        showSpinner();
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
          alert(
            `${changeLanguage === "en" ? languages.en.failedResponseText : languages.ja.failedResponseText}`,
          );
          return;
        }
        const result = await response.json();
        //console.log("Upload result:", result);
        if (result.success) {
          alert(result.message);
          /*           const profilePic = document.getElementById("user-avatar");
          profilePic.src = imageData; //update the profile picture */
          const userData = JSON.parse(localStorage.getItem("loggedIn"));
          userData.avatar = result.fileId;
          localStorage.setItem("loggedIn", JSON.stringify(userData));
          //immediately display selected image
          const previewURL = URL.createObjectURL(file);
          profilePic.src = previewURL;
          hideSpinner();
        } else {
          alert(
            `${changeLanguage === "en" ? languages.en.failedUploadText : languages.ja.failedUploadText}`,
          );
        }
      };
    } catch (error) {
      console.error("Error reading file:", error);
      alert(
        `${changeLanguage === "en" ? languages.en.avatarUploadError : languages.ja.avatarUploadError}`,
      );
      hideSpinner();
      hideGlobalAuth();
      return;
    } finally {
      hideSpinner();
      hideGlobalAuth();
    }
    reader.readAsDataURL(file); //open the file and convert it to string
  });
}
