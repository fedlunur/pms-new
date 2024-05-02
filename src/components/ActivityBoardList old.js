import React from "react";

import { Row, Col, Card, CardBody } from "reactstrap";

import { generateQuoteMap } from "../dnd/mockData";

import Board from "../dnd/board/Board";
import Layout from "../views/Layout";

export default function ActivityBoardList() {
  const data = {
    medium: generateQuoteMap(100),
    large: generateQuoteMap(500),
  };

  return (
    <Layout>
      <Row className="justify-content-center text-center">
        <Col xs={12}>
          <Card>
            <CardBody>
              <h2>React DnD Testing</h2>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Board initial={data.medium} withScrollableColumns />
    </Layout>
  );
}
