import { useTheme } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
const cloudinaryApi = import.meta.env.VITE_CLOUDINARY_API;
const cloudinaryApiKey = import.meta.env.VITE_CLOUDINARY_KEY;
export default function TinyMCE({
  desc,
  setDesc,
}: {
  desc: string;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleImageUpload = (blobInfo: any, progress: any, failure: any) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${cloudinaryApi}`, true);
      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());
      formData.append("upload_preset", "unsigned_preset");
      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100);
        if (progress && typeof progress === "function") {
          const percent = 0;
          progress(percent);
        }
      };

      xhr.upload.onprogress = (e) => {
        if (progress && typeof progress === "function") {
          progress((e.loaded / e.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status > 300) {
          if (failure && typeof failure === "function") {
            failure("Upload thất bại");
          }
          reject("Upload thất bại");
        } else {
          const response = JSON.parse(xhr.responseText);
          if (response && response.secure_url) {
            resolve(response.secure_url);
          } else {
            reject("Không tìm thấy URL ảnh");
          }
        }
      };

      xhr.onerror = () => {
        if (failure && typeof failure === "function") {
          failure("Upload thất bại");
        }
        reject("Upload thất bại");
      };

      xhr.send(formData);
    });
  };

  const theme = useTheme();

  const editorStyles = `
    .tox .tox-edit-area__iframe { 
      background-color: ${theme.palette.background.default} !important;
      font-family: ${theme.typography.fontFamily} !important;
    }

    .tox:not(.tox-tinymce-inline) .tox-editor-header {
      padding: 0
    }
    .tox .tox-toolbar,.tox-editor-header,.tox-menubar,.tox-promotion,.tox .tox-toolbar__primary{
      background-color:  ${theme.palette.background.default} !important;
    }
    .tox .tox-statusbar {
      background-color: ${theme.palette.background.default} !important;
    }
    .tox .tox-mbtn,.tox .tox-toolbar-overlord .tox-toolbar__primary button {
      background-color: ${theme.palette.background.default} !important;
      color: ${theme.palette.text.primary} !important;
    }
    .tox .tox-tbtn svg{
      fill: ${theme.palette.text.primary} !important;
    }
  `;

  const contentStyle = `
    p {
      color: ${theme.palette.text.primary};
    }
  `;
  return (
    <>
      <style>{editorStyles}</style>
      <Editor
        value={desc}
        onEditorChange={setDesc}
        apiKey={cloudinaryApiKey}
        init={{
          height: 500,
          images_upload_url: `${cloudinaryApi}`,
          automatic_uploads: true,
          images_reuse_filename: true,
          images_upload_handler: handleImageUpload,
          content_style: contentStyle,
        }}
      />
    </>
  );
}
