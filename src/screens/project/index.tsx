import React from "react";
import { Link } from "react-router-dom";
import { Routes, Route, Navigate, useLocation } from "react-router";
import { EpicScreen } from "screens/epic";
import { KanbanScreen } from "screens/kanban";
import styled from "@emotion/styled";
import { Menu } from "antd";

const useRouteType = () => {
  const units = useLocation().pathname.split("/");
  return units[units.length - 1];
};

export const ProjectScreen = () => {
  const routeType = useRouteType();
  return (
    <Container>
      <Aside>
        <Menu selectedKeys={[routeType]}>
          <Menu.Item key={"kanban"}>
            <Link to={"kanban"}>看板</Link>
          </Menu.Item>
          <Menu.Item key={"epic"}>
            <Link to={"epic"}>任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          <Route path={"/kanban"} element={<KanbanScreen />}></Route>
          <Route path={"/epic"} element={<EpicScreen />}></Route>
          <Route
            path={"*"}
            element={
              <Navigate
                to={window.location.pathname + "/kanban"}
                replace={true}
              />
            }
          ></Route>
          {/* <Navigate to={String(window.location.pathname+'/kanban')}/> */}
        </Routes>
      </Main>
    </Container>
  );
};

const Aside = styled.aside`
  /* background-color: rgb(244,245,247); */
  display: flex;
  flex-direction: column;
`;
const Main = styled.div`
  box-shadow: -5px 0 5px -5px rgb(0, 0, 0, 0.1);
  display: flex;
  overflow-y: scroll;

  height: calc(100vh - 12rem);
  /* height: 100%; */
`;
const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
  overflow: hidden;
`;
