import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Img,
} from "@react-email/components";

interface OrderConfirmationEmailProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
  deliveryMethod: string;
  // Billing address (fakturační adresa)
  billingAddress?: string;
  billingCity?: string;
  billingPostalCode?: string;
  // Delivery address
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryPostalCode?: string;
  deliveryName?: string;
  differentDeliveryAddr?: boolean;
  paymentMethod: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
    slug: string;
    materialType?: string;
  }>;
  deliveryCost: number;
  codFee: number;
  total: number;
  notes?: string;
  // Company fields
  companyName?: string;
  companyIc?: string;
  companyDic?: string;
}

export function OrderConfirmationEmail({
  customerName,
  customerEmail,
  customerPhone,
  orderId,
  deliveryMethod,
  billingAddress = "",
  billingCity = "",
  billingPostalCode = "",
  deliveryAddress = "",
  deliveryCity = "",
  deliveryPostalCode = "",
  deliveryName = "",
  differentDeliveryAddr = false,
  paymentMethod,
  items,
  deliveryCost,
  codFee,
  total,
  notes = "",
  companyName,
  companyIc,
  companyDic,
}: OrderConfirmationEmailProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("cs-CZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatPostalCode = (postalCode: string) => {
    return postalCode.replace(/^(\d{3})(\d{2})$/, "$1 $2");
  };

  const paymentMethodText = {
    BANK_TRANSFER: "Převodem",
    CASH_ON_DELIVERY: "Dobírka",
    CASH_IN_PERSON: "Hotově",
  };

  const deliveryMethodText = {
    PPL: "PPL",
    SELF_COLLECTION: "Osobní odběr",
  };

  // Calculate VAT (21%)
  const totalWithVat = total;
  const totalWithoutVat = Math.round(total / 1.21);
  const vatAmount = totalWithVat - totalWithoutVat;

  // Calculate subtotal (products only, without delivery and cod fee)
  const subtotal = total - deliveryCost - codFee;

  // Bank details
  const bankAccount = "1209442007/2700";

  // Logo URL - use absolute URL
  const logoUrl = "https://shop.vcelarstvi-bubenik.cz/images/logo.png";

  return (
    <Html>
      <Head />
      <Preview>Potvrzení objednávky {orderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src={logoUrl}
              alt="Včelařské potřeby Bubeník"
              style={{ width: "120px", height: "auto", display: "block", margin: "0 auto" }}
            />
          </div>

          <Heading style={heading}>Potvrzení objednávky</Heading>

          <Text style={text}>Vážený zákazníku,</Text>
          <Text style={text}>Vaši objednávku jsem v pořádku přijal.</Text>

          <Text style={text}>
            Číslo objednávky: <strong>{orderId}</strong>
          </Text>
          <Text style={text}>Datum: {formatDate(new Date())}</Text>

          <Section style={section}>
            {paymentMethod === "BANK_TRANSFER" ? (
              <>
                <Text style={text}>
                  {deliveryMethod === "SELF_COLLECTION"
                    ? "Zboží pro Vás bude připraveno na adrese provozovny ihned po připsání celkové částky "
                    : "Zboží Vám odešlu ihned po připsání celkové částky "}
                  <strong>{formatPrice(totalWithVat)}</strong> na můj účet:
                </Text>
                <Text style={text}>Číslo účtu: <strong>{bankAccount}</strong></Text>
                <Text style={text}>
                  Variabilní symbol platby: <strong>{orderId}</strong>
                </Text>
              </>
            ) : paymentMethod === "CASH_ON_DELIVERY" ? (
              <>
                <Text style={text}>
                  Zaplatíte při převzetí zboží přímo kurýrovi PPL. Celková částka k úhradě:{" "}
                  <strong>{formatPrice(totalWithVat)}</strong>
                </Text>
                <Text style={text}>
                  Po odeslání zboží Vám zašlu trackovací kód pro sledování zásilky.
                </Text>
              </>
            ) : (
              <>
                <Text style={text}>
                  Platba v hotovosti při osobním vyzvednutí. Celková částka k úhradě:{" "}
                  <strong>{formatPrice(totalWithVat)}</strong>
                </Text>
                <Text style={text}>
                  O možnosti vyzvednout objednané zboží Vás budu informovat v dalším emailu.
                </Text>
              </>
            )}
          </Section>

          <Heading style={sectionHeading}>Obsah objednávky</Heading>
          <Section style={itemsSection}>
            <table style={itemsTable} cellPadding="0" cellSpacing="0" width="100%">
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={itemNameCell} width="50%">
                    <Link
                      href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://shop.vcelarstvi-bubenik.cz"}/produkt/${item.slug}`}
                      style={linkStyle}
                    >
                      {item.name}
                      {item.materialType && item.size && ` (${item.materialType}, ${item.size})`}
                      {item.materialType && !item.size && ` (${item.materialType})`}
                      {!item.materialType && item.size && ` (${item.size})`}
                    </Link>
                  </td>
                  <td style={itemDetailsCell} width="25%">
                    {item.quantity} ks × {formatPrice(item.price)}
                  </td>
                  <td style={itemPriceCell} width="25%">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
              {deliveryMethod === "PPL" && (
                <tr>
                  <td style={itemDetailsCell}>
                    {deliveryMethodText[deliveryMethod as keyof typeof deliveryMethodText]}
                  </td>
                  <td style={itemDetailsCell}></td>
                  <td style={itemPriceCell}>
                    {formatPrice(deliveryCost)}
                  </td>
                </tr>
              )}
              <tr>
                <td style={itemDetailsCell}>
                  {paymentMethodText[paymentMethod as keyof typeof paymentMethodText]}
                </td>
                <td style={itemDetailsCell}></td>
                <td style={itemPriceCell}>
                  {formatPrice(codFee)}
                </td>
              </tr>
            </table>
          </Section>

          <Section style={summarySection}>
            <Text style={totalLine}>
              <strong>CENA CELKEM: {formatPrice(totalWithVat)}</strong>
            </Text>
            <Text style={subtotalLine}>
              Cena bez DPH: {formatPrice(totalWithoutVat)}
            </Text>
            <Text style={subtotalLine}>
              DPH: {formatPrice(vatAmount)}
            </Text>
          </Section>

          {/* Two columns for billing and delivery addresses */}
          <Section style={addressSection}>
            <table
              style={addressTable}
              cellPadding="0"
              cellSpacing="0"
              width="100%"
            >
              <tr>
                <td style={addressColumn} width="48%" valign="top">
                  <Heading style={addressHeading}>Fakturační údaje</Heading>
                  <Text style={text}>Jméno a příjmení: {customerName}</Text>
                  {companyName && (
                    <Text style={text}>Firma: {companyName}</Text>
                  )}
                  {companyIc && (
                    <Text style={text}>IČ: {companyIc}</Text>
                  )}
                  {companyDic && (
                    <Text style={text}>DIČ: {companyDic}</Text>
                  )}
                  {billingAddress && (
                    <Text style={text}>Ulice: {billingAddress}</Text>
                  )}
                  {billingCity && (
                    <Text style={text}>Město: {billingCity}</Text>
                  )}
                  {billingPostalCode && (
                    <Text style={text}>PSČ: {formatPostalCode(billingPostalCode)}</Text>
                  )}
                  <Text style={text}>Stát: Česká republika</Text>
                  <Text style={text}>E-mail: <a href={`mailto:${customerEmail}`} style={inlineLinkStyle}>{customerEmail}</a></Text>
                  <Text style={text}>Telefon: <a href={`tel:${customerPhone.replace(/\s/g, "")}`} style={inlineLinkStyle}>{customerPhone}</a></Text>
                  {notes && (
                    <Text style={text}>Poznámka: {notes}</Text>
                  )}
                </td>
                <td style={addressSpacer} width="4%"></td>
                <td style={addressColumn} width="48%" valign="top">
                  <Heading style={addressHeading}>Doručovací údaje</Heading>
                  {deliveryMethod === "SELF_COLLECTION" ? (
                    <Text style={text}>
                      Osobní vyzvednutí na adrese: Polní 46, 789 61 Bludov
                    </Text>
                  ) : (
                    <>
                      <Text style={text}>Jméno: {deliveryName}</Text>
                      {differentDeliveryAddr && companyName && (
                        <Text style={text}>Firma: {companyName}</Text>
                      )}
                      {deliveryAddress && (
                        <Text style={text}>Ulice: {deliveryAddress}</Text>
                      )}
                      {deliveryCity && (
                        <Text style={text}>Město: {deliveryCity}</Text>
                      )}
                      {deliveryPostalCode && (
                        <Text style={text}>PSČ: {formatPostalCode(deliveryPostalCode)}</Text>
                      )}
                      <Text style={text}>Stát: Česká republika</Text>
                    </>
                  )}
                </td>
              </tr>
            </table>
          </Section>

          <Text style={thankYouText}>Děkuji za objednávku.</Text>

          <Section style={footerSection}>
            <Text style={text}>Petr Bubeník - včelařské potřeby</Text>
            <Text style={text}>
              tel.: <a href="tel:+420777553319" style={inlineLinkStyle}>+420 777 553 319</a>
            </Text>
            <Text style={text}>
              email: <a href="mailto:obchod@vcelarstvi-bubenik.cz" style={inlineLinkStyle}>obchod@vcelarstvi-bubenik.cz</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  color: "#1a1a1a",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1a1a1a",
  textAlign: "center" as const,
  marginBottom: "10px",
};

const section = {
  marginBottom: "20px",
  padding: "10px 0",
};

const sectionHeading = {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "10px",
  color: "#1a1a1a",
};

const itemsSection = {
  backgroundColor: "#f8f9fa",
  border: "1px solid #e9ecef",
  borderRadius: "8px",
  padding: "10px",
};

const itemsTable = {
  width: "100%" as const,
  borderCollapse: "collapse" as const,
};

const itemNameCell = {
  padding: "8px 4px",
  fontSize: "14px",
  verticalAlign: "top" as const,
};

const itemDetailsCell = {
  padding: "8px 4px",
  fontSize: "14px",
  color: "#666666",
  verticalAlign: "top" as const,
};

const itemPriceCell = {
  padding: "8px 4px",
  fontSize: "14px",
  fontWeight: "bold",
  color: "#1a1a1a",
  textAlign: "right" as const,
  verticalAlign: "top" as const,
};

const summarySection = {
  backgroundColor: "#fffbeb",
  border: "1px solid #fcd34d",
  borderRadius: "8px",
  padding: "15px",
};

const addressSection = {
  marginTop: "10px",
};

const addressTable = {
  width: "100%" as const,
  borderCollapse: "collapse" as const,
};

const addressColumn = {
  fontSize: "14px",
};

const addressSpacer = {
  fontSize: "0",
  lineHeight: "0",
};

const addressHeading = {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "10px",
  color: "#1a1a1a",
};

const footerSection = {
  backgroundColor: "#fef9f3",
  border: "1px solid #fcd34d",
  borderRadius: "8px",
  padding: "15px",
  marginTop: "20px",
};

const text = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#1a1a1a",
  margin: "5px 0",
};

const thankYouText = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#1a1a1a",
  margin: "20px 0",
};

const itemContainer = {
  marginBottom: "12px",
  paddingBottom: "12px",
  borderBottom: "1px solid #e9ecef",
};

const itemText = {
  fontSize: "14px",
  color: "#1a1a1a",
  margin: "2px 0",
};

const itemDetails = {
  fontSize: "14px",
  color: "#666666",
  margin: "2px 0",
};

const itemPrice = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "4px 0 2px 0",
};

const totalLine = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1a1a1a",
  textAlign: "right" as const,
  marginBottom: "5px",
};

const subtotalLine = {
  fontSize: "14px",
  color: "#1a1a1a",
  textAlign: "right" as const,
  margin: "0",
};

const linkStyle = {
  fontSize: "14px",
  color: "#2563eb",
  textDecoration: "underline",
  display: "block",
  margin: "0 0 4px 0",
  fontWeight: "500",
};

const inlineLinkStyle = {
  fontSize: "14px",
  color: "#2563eb",
  textDecoration: "underline",
};
