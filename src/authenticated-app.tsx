import { useAuth } from "context/auth-context";
import { ProjectListScreen } from "screens/project-list";
import styled from "@emotion/styled";
import { ButtonNoPadding, Row } from "components/lib";
import { Button, Dropdown, Menu } from "antd";
import { resetRoute, useDocumentTitle } from "utils";
import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { ProjectScreen } from "screens/project";
import { ProjectModal } from "screens/project-list/project-modal";
import { ProjectPopover } from "components/project-popover";
import { UserPopover } from "components/user-popover";
// 登录后的页面
/**
 *
 * gird和flex各自的应用场景
 * 1.要考虑，是一维布局 还是 二维布局
 * 一维用flex 二维用grid
 * 2.是从内部出发还是布局出发
 * 从内容出发：现有一组内容（一般不固定）然后希望他们均匀的分布
 * 从内容出发：用flex
 * 从布局出发: 用grid
 */
export const AuthenticatedApp = () => {
  // const [projectModalOpen, setProjectModalOpen] = useState(false);
  return (
    <Container>
      <Router>
        <PageHeader />
        <Main>
          <Routes>
            <Route path={"/projects"} element={<ProjectListScreen />}></Route>
            <Route
              path={"/projects/:projectId/*"}
              element={<ProjectScreen />}
            ></Route>
            <Route path={"*"} element={<Navigate to={"/projects"} />}></Route>
          </Routes>
        </Main>
        <ProjectModal
        // projectModalOpen={projectModalOpen}
        // onClose={() => setProjectModalOpen(false)}
        ></ProjectModal>
      </Router>
    </Container>
  );
};

const PageHeader = () => {
  useDocumentTitle("项目列表", false);
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type={"link"} onClick={resetRoute}>
          <h3>Logo</h3>
        </ButtonNoPadding>
        <ProjectPopover />
        <UserPopover />
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  );
};
const User = () => {
  const { logout, user } = useAuth();
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={"logout"}>
            <Button type={"link"} onClick={logout}>
              退出
            </Button>
          </Menu.Item>
        </Menu>
      }
    >
      {/* @ts-ignore */}
      <Button type={"link"} onClick={(e) => e.preventDefault()}>
        Hi,{user?.name}
      </Button>
    </Dropdown>
  );
};
const Container = styled.div`
  /* display: grid;
    grid-template-columns: 20rem 1fr 20rem; */
  height: 100vh;
  overflow: hidden;
`;

const Header = styled(Row)`
  /* padding: 3.2rem; */
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
  padding: 3.2rem;
`;
const HeaderLeft = styled(Row)`
  font-size: 2rem;
`;
const HeaderRight = styled.div``;
const Main = styled.main`
  height: calc(100vh - 6rem);
  overflow: hidden;
  /* display: flex; */
`;
