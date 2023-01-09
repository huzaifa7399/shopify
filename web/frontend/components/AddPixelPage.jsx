import React from "react";
import {
  Card,
  Layout,
  Page,
  TextField,
  Icon,
  Button,
  ChoiceList,
  Checkbox,
  Modal,
  ContextualSaveBar,
  Frame,
  IndexTable,
  // Text,
  useIndexResourceState,
} from "@shopify/polaris";
import {
  DiamondAlertMajor,
  CircleAlertMajor,
  ArrowLeftMinor,
} from "@shopify/polaris-icons";
import { useState, useCallback, useEffect } from "react";
import { useAuthenticatedFetch } from "../hooks";

const AddPixelPage = ({ handlePixelClick }) => {
  const fetch = useAuthenticatedFetch();
  const [myProducts, setMyProducts] = useState([]);
  let newAeeeer;
  const getProducts = async () => {
    // console.log("tesst");
    try {
      const resp = await fetch("/api/products");
      const data = await resp.json();
      // console.log(data);
      setMyProducts(data.products);
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(myProducts);

  let dataArr = JSON.parse(localStorage.getItem("data")) || [];
  let editId = parseInt(localStorage.getItem("editId"));
  let pixelId = parseInt(localStorage.getItem("pixelId"));
  console.log(pixelId);
  console.log(editId);
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState(["AllPages"]);
  const [active, setActive] = useState(false);

  const [value, setValue] = useState(dataArr[editId]?.pixelId || "");
  const [pixelName, setPixelName] = useState(dataArr[editId]?.title || "");
  const [fbAccess, setFbAccess] = useState(
    dataArr[editId]?.fbAccessToken || ""
  );
  const [disabled, setDisabled] = useState(true);
  const [data, setData] = useState([
    {
      pixelId: "",
      title: "",
      tracking: "",
      conversionAPI: false,
      fbAccessToken: "",
    },
  ]);
  const handleChangeChoice = useCallback(
    (newChecked) => setChecked(newChecked),
    []
  );
  const handleChange = useCallback((value) => setSelected(value), []);
  const handleChangeModal = useCallback(() => setActive(!active), [active]);
  const handleChangePixelID = useCallback((newValue) => setValue(newValue), []);
  const handleChangePixelName = useCallback(
    (newValue) => setPixelName(newValue),
    []
  );
  const handleChangeToken = useCallback(
    (newValue) => setFbAccess(newValue),
    []
  );
  const handleSave = () => {
    let emptyobj = {
      pixelId: value,
      title: pixelName,
      tracking: selected[0],
      conversionAPI: checked,
      fbAccessToken: fbAccess,
    };
    setData([
      {
        pixelId: value,
        title: pixelName,
        tracking: selected[0],
        conversionAPI: checked,
        fbAccessToken: fbAccess,
      },
    ]);
    // console.log(dataArr);
    // editId === 0 ? dataArr.pop() : dataArr.splice(editId, 1);

    // editId
    //   ? editId > 0
    //     ? dataArr.splice(editId, 1)
    //     : editId === 0
    //     ? dataArr.pop()
    //     : null
    //   : null;
    editId ? dataArr.splice(editId, 1) : null;

    // console.log(dataArr);
    // let newArr = dataArr.filter((data) => data.pixelId !== pixelId.toString());

    console.log(dataArr);
    dataArr.push(emptyobj);
    localStorage.setItem("data", JSON.stringify(dataArr));
    setData([
      {
        pixelId: setValue(""),
        title: setPixelName(""),
        tracking: "",
        conversionAPI: setChecked(""),
        fbAccessToken: setFbAccess(""),
      },
    ]);
  };
  const customers = myProducts;

  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(customers);
  // console.log(selectedResources);
  const rowMarkup = customers.map(
    ({ id, title, image, orders, amountSpent }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <h1>{title}</h1>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <img src={image.src} width="40px" />
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );
  useEffect(() => {
    getProducts();
  }, []);
  const handleDiscard = () => {
    // setDisabled(!disabled);
    setData([
      {
        pixelId: setValue(""),
        title: setPixelName(""),
        tracking: "",
        conversionAPI: setChecked(""),
        fbAccessToken: setFbAccess(""),
      },
    ]);
    console.log("add clear form logic");
  };
  const validate = () => {
    return value && fbAccess && pixelName;
  };
  // console.log(data, validate());

  return (
    <>
      <Page>
        {validate() ? (
          <Frame>
            <ContextualSaveBar
              message="Unsaved changes"
              saveAction={{
                onAction: handleSave,
                loading: false,
                // disabled: disabled,
              }}
              discardAction={{
                onAction: handleDiscard,
              }}
            />
          </Frame>
        ) : null}

        <div id="customTitleTwo">
          <Button onClick={handlePixelClick}>
            <Icon source={ArrowLeftMinor} />
          </Button>
          <h1>Pixel Manager</h1>
        </div>
        <Layout>
          <Layout.Section>
            <Card>
              <div id="secondPage">
                <h1 className="pixeTitle">Add Facebook Pixel</h1>
                <TextField
                  label="Name your pixel* "
                  placeholder="Any Name will do. This is just so you can manage different pixels easily"
                  id="textFieldDiv"
                  value={pixelName}
                  onChange={handleChangePixelName}
                />
                <hr />
                <TextField
                  label="Pixel ID* "
                  placeholder="Copy pixel ID from Facebook and paste here"
                  id="textFieldDiv"
                  value={value}
                  onChange={handleChangePixelID}
                />
                <h1 className="pixeTitle">Tracking on Pages</h1>
                <div id="customChoice">
                  <ChoiceList
                    choices={[
                      { label: "All Pages", value: "AllPages" },
                      {
                        label: "Selected Page(s)",
                        value: "SelectedPages",
                      },
                    ]}
                    selected={selected}
                    onChange={handleChange}
                  />
                  {selected[0] !== "AllPages" ? (
                    <div id="customButtonGroup">
                      <Button onClick={handleChangeModal}>
                        + Select Collection(s)
                      </Button>
                      <Button onClick={handleChangeModal}>
                        + Product with Type(s)
                      </Button>
                      <Button onClick={handleChangeModal}>
                        + Product with Tag(s)
                      </Button>
                      <Button onClick={handleChangeModal}>
                        + Select Product(s)
                      </Button>
                      <div id="customModal"></div>
                      <Modal
                        open={active}
                        onClose={handleChangeModal}
                        title="Select Collection"
                        primaryAction={{
                          content: "Add",
                          onAction: handleChangeModal,
                        }}
                        secondaryActions={[
                          {
                            content: "Cancel",
                            onAction: handleChangeModal,
                          },
                        ]}
                      >
                        <Modal.Section>
                          <Card>
                            <IndexTable
                              resourceName={resourceName}
                              itemCount={customers.length}
                              selectedItemsCount={
                                allResourcesSelected
                                  ? "All"
                                  : selectedResources.length
                              }
                              onSelectionChange={handleSelectionChange}
                              headings={[
                                { title: "Title" },
                                { title: "Image" },
                              ]}
                            >
                              {rowMarkup}
                            </IndexTable>
                          </Card>
                        </Modal.Section>
                      </Modal>
                    </div>
                  ) : null}
                  <div id="customError">
                    <Icon source={DiamondAlertMajor} />
                    <h1>
                      Please select collection, product tag, product type or
                      product before saving FB Pixel
                    </h1>
                  </div>
                </div>
              </div>
            </Card>
            <Card>
              {" "}
              <div id="secondPagePartTwo">
                <Checkbox
                  label="Conversions API (solution for IOS 14.5)"
                  checked={checked}
                  onChange={handleChangeChoice}
                />
                <h1 className="customHeading">
                  Enable server-side API to track all customer behavior events
                  bypassing the browser's limitation, or ad-blockers
                </h1>
                <div id="customErrorYellow">
                  <Icon source={CircleAlertMajor} />
                  <h1>
                    You have used up 1 API(s). Please upgrade to add more ID's
                    Conversion API. <span>Upgrade Here</span>
                  </h1>
                </div>
                <hr />
                <TextField
                  label="Fill Facebook Access Token "
                  value={fbAccess}
                  onChange={handleChangeToken}

                  // placeholder="Copy pixel ID from Facebook and paste here"
                />
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default AddPixelPage;
