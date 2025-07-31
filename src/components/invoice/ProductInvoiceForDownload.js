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
    width: "12.5%",
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

const ProductInvoiceForDownload = ({ data }) => {
  if (!data) {
    return null;
  }
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.invoiceFirst}>
          <View>
            <Text style={{ fontFamily: "Open Sans", fontWeight: "bold" }}>
              PURCHASE INVOICE
            </Text>
            <Text style={styles.info}>
              Status :{" "}
              {data.status === "active" && (
                <Text style={{ color: "#22c55e" }}>{data.status}</Text>
              )}
              {data.status === "inactive" && (
                <Text style={{ color: "#f43f5e" }}>{data.status}</Text>
              )}
            </Text>
          </View>
          <View>
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
            <Text style={styles.info}>Product ID: {data?.id}</Text>
            <Text style={styles.info}>Category: {data?.category?.name || "N/A"}</Text>
            <Text style={styles.info}>SKU: {data?.sku || "N/A"}</Text>
          </View>
          <View>
            <Text style={styles.title}>INVOICE NO</Text>
            <Text style={styles.info}>#PN00{data.id}</Text>
          </View>
          <View>
            <Text style={styles.title}>PRODUCT DETAILS</Text>
            <Text style={styles.info}>{data.title}</Text>
            <Text style={styles.info}>
              {data.description && data.description.substring(0, 30)}
              {data.description && data.description.length > 30 && "..."}
            </Text>
            <Text style={styles.info}>Brand: {data.brand || "N/A"}</Text>
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
                <Text style={styles.header}>Category</Text>
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.header}>Brand</Text>
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.header}>Price</Text>
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.header}>Stock</Text>
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.header}>Status</Text>
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>1</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {data.title.substring(0, 20)}{" "}
                {data.title.length > 20 && "..."}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {data?.category?.name || "N/A"}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {data.brand || "N/A"}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.quantity}>
                  ${data.price || 0}
                </Text>
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.quantity}>
                  {data.stock || 0}
                </Text>
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                <Text style={styles.status}>
                  {data.status}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.invoiceThird}>
          <View>
            <Text style={styles.title}>Product Status</Text>
            <Text style={styles.info}>{data.status}</Text>
          </View>
          <View>
            <Text style={styles.title}>Stock Quantity</Text>
            <Text style={styles.info}>{data.stock || 0} units</Text>
          </View>
          <View>
            <Text style={styles.title}>Product Price</Text>
            <Text style={styles.amount}>${Math.round(data.price || 0)}.00</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ProductInvoiceForDownload; 