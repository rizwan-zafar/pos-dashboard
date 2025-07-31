import {
  Document,
  Page,
  Image,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import dayjs from "dayjs";

// import logoLight from "../../assets/img/logo/logo-dark.png";
import logoDark from "../../assets/img/logo/logo.png";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});
Font.register({
  family: "DejaVu Sans",
  fonts: [
    {
      src: "https://kendo.cdn.telerik.com/2017.2.621/styles/fonts/DejaVu/DejaVuSans.ttf",
    },
    {
      src: "https://kendo.cdn.telerik.com/2017.2.621/styles/fonts/DejaVu/DejaVuSans-Bold.ttf",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    marginRight: 10,
    marginBottom: 20,
    marginLeft: 10,
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 60,
    lineHeight: 1.5,
  },
  table: {
    display: "table",
    width: "auto",
    color: "#4b5563",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: "#d1d5db",
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  invoiceFirst: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
    borderBottom: 0.5,
  },
  invoiceSecond: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 20,
  },
  invoiceThird: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 20,
  },
  logo: {
    width: 30,
    height: 24,
    bottom: 0,
  },
  title: {
    color: "#111827",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    fontSize: 13,
  },
  info: {
    fontSize: 10,
    color: "#374151",
  },
  amount: {
    fontSize: 10,
    color: "#ef4444",
  },
  status: {
    color: "#10b981",
  },
  quantity: {
    color: "#1f2937",
  },
  header: {
    color: "#111827",
    fontSize: 11,
    fontFamily: "Open Sans",
    fontWeight: "bold",
  },
});

const InvoiceForDownload = ({ data }) => {
  if (!data.items || !Array.isArray(data.items)) {
    return null;
  }
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.invoiceFirst}>
          <View>
            <Text style={{ fontFamily: "Open Sans", fontWeight: "bold" }}>
              INVOICE
            </Text>
            <Text style={styles.info}>
              Status :{" "}
              {data.status === "Pending" && (
                <Text style={{ color: "#eab308" }}>{data.status}</Text>
              )}
              {data.status === "Processing" && (
                <Text style={{ color: "#14b8a6" }}>{data.status}</Text>
              )}
              {data.status === "Delivered" && (
                <Text style={{ color: "#22c55e" }}>{data.status}</Text>
              )}
              {data.status === "Cancel" && (
                <Text style={{ color: "#f43f5e" }}>{data.status}</Text>
              )}
            </Text>
          </View>
          <View>
            {/* <Image style={styles.logo} src={logoLight} /> */}
            <Text className="flex items-center justify-start ml-5">
              <Image style={{...styles.logo}} src={logoDark} alt="sardarbaba"  />
              <Text  style={{ fontFamily: "Open Sans", fontWeight: "bold" }}>SARDARSTORE</Text>
            </Text>
            <Text style={styles.info}>Lahore, Punjab, 54000, </Text>
            <Text style={styles.info}>Pakistan.</Text>
          </View>
        </View>
        <View style={styles.invoiceSecond}>
          <View>
            <Text style={styles.title}>DATE</Text>
            <Text style={styles.info}>
              {data.createdAt !== undefined && (
                <Text>{dayjs(data?.createdAt).format("MMMM D, YYYY")}</Text>
              )}
            </Text>
            <Text style={styles.info}>{data?.user?.name}</Text>
            <Text style={styles.info}>{data?.user?.email}</Text>
            <Text style={styles.info}>{data?.user?.address}</Text>
            <Text style={styles.info}>{data?.user?.phone}</Text>
          </View>
          <View>
            <Text style={styles.title}>INVOICE NO</Text>
            <Text style={styles.info}>#ON00{data.id}</Text>
          </View>
          <View>
            <Text style={styles.title}>INVOICE TO</Text>
            <Text style={styles.info}>{data.user.name}</Text>
            <Text style={styles.info}>
              {" "}
              {data.user.address.substring(0, 25)}
            </Text>
            {/* <Text style={styles.info}>
                {data.city}, {data.country}, {data.zipCode}
              </Text> */}
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.header}>Sr.</Text>
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.header}>Product Name</Text>
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.header}>Size</Text>
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.header}>Quantity</Text>
              </Text>
            </View>

            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.header}>Item Price</Text>
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.header}>Delivey Fee</Text>
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.header}>Amount</Text>
              </Text>
            </View>
          </View>
          {data?.items?.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{i + 1}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {item.productDetails.title.substring(0, 30)}{" "}
                  {item.productDetails.title.length > 30 && "..."}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {(item.selectedVariation &&
                  typeof item.selectedVariation === "string"
                    ? item.selectedVariation
                    : item.selectedVariation?.size) || "-"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                </Text>
              </View>

              {/* <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <Text style={styles.quantity}>
                    ${item.productDetails.price}.00
                  </Text>
                </Text>
              </View> */}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <Text style={styles.quantity}>
                    ${" "}
                    {item.selectedVariation
                      ? typeof item.selectedVariation === "string"
                        ? // Jab variation string ho
                          JSON.parse(item.productDetails.variations).find(
                            (v) => v.size === item.selectedVariation
                          )?.promo_price_pkr ||
                          JSON.parse(item.productDetails.variations).find(
                            (v) => v.size === item.selectedVariation
                          )?.price
                        : // Jab variation object ho
                          item.selectedVariation.promo_price_pkr ||
                          item.selectedVariation.price
                      : // Jab variations na ho
                        item.productDetails.promo_price_pkr ||
                        item.productDetails.price}
                  </Text>
                </Text>
              </View>

              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <Text style={styles.quantity}>
                    {item.productDetails.delivery
                      ? "Rs " + item?.productDetails.delivery
                      : "Free Shipping"}{" "}
                  </Text>
                </Text>
              </View>

              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <Text style={styles.amount}>
                    ${" "}
                    {item.quantity *
                      (item.selectedVariation
                        ? typeof item.selectedVariation === "string"
                          ? // Jab variation string ho
                            JSON.parse(item.productDetails.variations).find(
                              (v) => v.size === item.selectedVariation
                            )?.promo_price_pkr ||
                            JSON.parse(item.productDetails.variations).find(
                              (v) => v.size === item.selectedVariation
                            )?.price
                          : // Jab variation object ho
                            item.selectedVariation.promo_price_pkr ||
                            item.selectedVariation.price
                        : // Jab variations na ho
                          item.productDetails.promo_price_pkr ||
                          item.productDetails.price) +
                      (item.productDetails.delivery || 0)}
                  </Text>
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.invoiceThird}>
          <View>
            <Text style={styles.title}> Payment Method</Text>
            <Text style={styles.info}> {data.paymentMethod} </Text>
          </View>
          <View>
            <Text style={styles.title}>Total Amount</Text>
            <Text style={styles.amount}>${Math.round(data.totalPrice)}.00</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceForDownload;
