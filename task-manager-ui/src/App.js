import "./App.css";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import axios from "axios";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Flex,
  Layout,
  Typography,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { GoogleCircleFilled } from "@ant-design/icons";
import TaskManager from "./TaskManager";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      console.log(tokenResponse);
      setLoading(true);
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => res.data);
      setUser(userInfo);
      setLoading(false);
      console.log(userInfo);
    },
  });

  const logout = () => {
    googleLogout();
    setUser(null);
  };

  return (
    <div>
      <Layout>
        <Content style={{ padding: "0 48px 50px 48px", height: "100vh" }}>
          <div
            style={{
              background: colorBgContainer,
              minHeight: "100vh",
              padding: 24,
              borderRadius: borderRadiusLG,
            }}
          >
            <Flex justify="space-between" align="center">
              <Typography.Title level={2}>Task Manager</Typography.Title>
              {user && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 1,
                        label: "Logout",
                        onClick: () => logout(),
                      },
                    ],
                  }}
                  trigger={["click", "hover"]}
                >
                  <Avatar size={64} src={user.picture} />
                </Dropdown>
              )}
            </Flex>
            <Divider />
            {!user ? (
              <Flex justify="center" align="center">
                <Button
                  size="large"
                  onClick={() => googleLogin()}
                  loading={loading}
                  type="primary"
                  icon={<GoogleCircleFilled />}
                >
                  Login With Google
                </Button>
              </Flex>
            ) : (
              <TaskManager user={user} />
            )}
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default App;
