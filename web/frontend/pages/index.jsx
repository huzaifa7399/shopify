import { useNavigate, TitleBar, Loading } from "@shopify/app-bridge-react";
import {
  Card,
  Layout,
  Page,
  SkeletonBodyText,
  IndexTable,
  useIndexResourceState,
  DataTable,
  TextField,
  Icon,
  Badge,
  Button,
} from "@shopify/polaris";
import { EditMajor } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
import AddPixelPage from "../components/AddPixelPage";
import { useAuthenticatedFetch } from "../hooks";
export default function HomePage() {
  const isLoading = false;
  const QRCodes = [];

  const loadingMarkup = isLoading ? (
    <Card sectioned>
      <Loading />
      <SkeletonBodyText />
    </Card>
  ) : null;
  let dataArr = JSON.parse(localStorage.getItem("data")) || [];

  const rows = dataArr.map((item, idx) => {
    return [
      item.pixelId,
      item.title,
      <div id="customBadge">
        <Badge>Active</Badge>{" "}
      </div>,

      <button
        id="customIcon"
        onClick={() => {
          console.log(idx, item.pixelId);

          localStorage.setItem("pixelId", item.pixelId);
          localStorage.setItem("editId", idx);
          setAddPixel(!addPixel);
        }}
      >
        <Icon source={EditMajor} />
      </button>,
    ];
  });

  const emptyStateMarkup =
    !isLoading && !QRCodes?.length ? (
      <div id="megaDiv">
        <Card>
          {/* <div id="textFieldDiv">
            <TextField
              placeholder="    Filter by pixel title"
              id="textFieldDiv"
            />
          </div> */}
          <div id="customTable">
            <DataTable
              columnContentTypes={["", "", "", ""]}
              headings={["Pixel ID", "Title", "Status", "Action"]}
              rows={rows}
            />
          </div>
        </Card>
      </div>
    ) : null;

  const [addPixel, setAddPixel] = useState(true);

  const handlePixelClick = () => {
    setAddPixel(!addPixel);
    localStorage.removeItem("editId");
  };

  return addPixel ? (
    <Page>
      <div id="customTitle">
        <h1>Pixel Manager</h1>
        <Button onClick={handlePixelClick}>+ Add Pixel</Button>
      </div>
      <Layout>
        <Layout.Section>
          {loadingMarkup}
          {emptyStateMarkup}
        </Layout.Section>
      </Layout>
    </Page>
  ) : (
    <AddPixelPage handlePixelClick={handlePixelClick} />
  );
}
