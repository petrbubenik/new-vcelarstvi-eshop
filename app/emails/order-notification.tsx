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
} from "@react-email/components";

interface OrderNotificationEmailProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: string;
  address?: string;
  city?: string;
  postalCode?: string;
  paymentMethod: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
    materialType?: string;
  }>;
  deliveryCost: number;
  codFee: number;
  total: number;
  companyName?: string;
  companyIc?: string;
  companyDic?: string;
}

export function OrderNotificationEmail({
  customerName,
  customerEmail,
  customerPhone,
  deliveryMethod,
  address,
  city,
  postalCode,
  paymentMethod,
  items,
  deliveryCost,
  codFee,
  total,
  companyName,
  companyIc,
  companyDic,
}: OrderNotificationEmailProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const paymentMethodText = {
    BANK_TRANSFER: "Bankovní převod",
    CASH_ON_DELIVERY: "Dobírka",
    CASH_IN_PERSON: "Hotově v provozovně",
  };

  const deliveryMethodText = {
    PPL: "Doručení PPL",
    SELF_COLLECTION: "Osobní odběr",
  };

  return (
    <Html>
      <Head />
      <Preview>Nová objednávka od {customerName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Nová objednávka</Heading>
          <Section style={section}>
            <Text style={text}>
              Právě byla vytvořena nová objednávka. Zde jsou detaily:
            </Text>
          </Section>

          <Section style={section}>
            <Heading style={sectionHeading}>Zákazník</Heading>
            <Text style={text}>
              <strong>Jméno:</strong> {customerName}
            </Text>
            <Text style={text}>
              <strong>E-mail:</strong> {customerEmail}
            </Text>
            <Text style={text}>
              <strong>Telefon:</strong> {customerPhone}
            </Text>
            {companyName && (
              <>
                <Text style={text}>
                  <strong>Firma:</strong> {companyName}
                </Text>
                {companyIc && (
                  <Text style={text}>
                    <strong>IČ:</strong> {companyIc}
                  </Text>
                )}
                {companyDic && (
                  <Text style={text}>
                    <strong>DIČ:</strong> {companyDic}
                  </Text>
                )}
              </>
            )}
          </Section>

          <Section style={section}>
            <Heading style={sectionHeading}>Doručení</Heading>
            <Text style={text}>
              <strong>Způsob:</strong> {deliveryMethodText[deliveryMethod as keyof typeof deliveryMethodText]}
            </Text>
            {deliveryMethod === "PPL" && address && (
              <>
                <Text style={text}>
                  <strong>Adresa:</strong>
                </Text>
                <Text style={text}>{address}</Text>
                <Text style={text}>
                  {postalCode} {city}
                </Text>
              </>
            )}
            {deliveryMethod === "SELF_COLLECTION" && (
              <Text style={text}>
                Osobní vyzvednutí na adrese: Polní 46, 789 61 Bludov
              </Text>
            )}
          </Section>

          <Section style={section}>
            <Heading style={sectionHeading}>Platba</Heading>
            <Text style={text}>
              <strong>Způsob:</strong> {paymentMethodText[paymentMethod as keyof typeof paymentMethodText]}
            </Text>
          </Section>

          <Section style={section}>
            <Heading style={sectionHeading}>Objednané položky</Heading>
            {items.map((item, index) => (
              <div key={index} style={itemContainer}>
                <Text style={itemText}>
                  {item.name} {item.materialType && item.size && `(${item.materialType}, ${item.size})`}
                  {item.materialType && !item.size && `(${item.materialType})`}
                  {!item.materialType && item.size && `(${item.size})`} × {item.quantity} ks
                </Text>
                <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
              </div>
            ))}
          </Section>

          <Section style={section}>
            <Heading style={sectionHeading}>Shrnutí</Heading>
            <Text style={text}>Mezisoučet: {formatPrice(total - deliveryCost - codFee)}</Text>
            {deliveryMethod === "PPL" && (
              <Text style={text}>
                Doprava: {deliveryCost === 0 ? "ZDARMA" : formatPrice(deliveryCost)}
              </Text>
            )}
            {codFee > 0 && (
              <Text style={text}>Dobírka: {formatPrice(codFee)}</Text>
            )}
            <Text style={totalText}>
              Celkem: {formatPrice(total)}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f6f6",
  color: "#1a1a1a",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1a1a1a",
};

const section = {
  marginBottom: "20px",
  padding: "20px 0",
  borderBottom: "1px solid #e5e5e5",
};

const sectionHeading = {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "10px",
  color: "#1a1a1a",
};

const text = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#1a1a1a",
};

const itemContainer = {
  marginBottom: "10px",
  paddingBottom: "10px",
  borderBottom: "1px solid #f0f0f0",
};

const itemText = {
  fontSize: "14px",
  marginBottom: "4px",
};

const itemPrice = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#1a1a1a",
};

const totalText = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1a1a1a",
};
