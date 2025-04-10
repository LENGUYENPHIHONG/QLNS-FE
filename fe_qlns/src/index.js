import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/reset.css";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN"; // nếu bạn muốn hiển thị tiếng Việt

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: "#3e0fe6", // màu chủ đạo (tùy chọn)
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

reportWebVitals();
