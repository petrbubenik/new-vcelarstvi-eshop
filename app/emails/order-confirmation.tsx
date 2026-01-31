import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OrderConfirmationEmailProps {
  customerName: string;
  orderId: string;
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
  }>;
  deliveryCost: number;
  codFee: number;
  total: number;
}

export function OrderConfirmationEmail({
  customerName,
  orderId,
  deliveryMethod,
  address,
  city,
  postalCode,
  paymentMethod,
  items,
  deliveryCost,
  codFee,
  total,
}: OrderConfirmationEmailProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      minimumFractionDigits: 0,
    }).format(price / 100);
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

  // PPL + Bank Transfer
  if (deliveryMethod === "PPL" && paymentMethod === "BANK_TRANSFER") {
    return (
      <Html>
        <Head />
        <Preview>Potvrzení objednávky #{orderId}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={heading}>Potvrzení objednávky</Heading>
            <Text style={text}>
              Dobrý den {customerName}, děkujeme za Vaši objednávku!
            </Text>
            <Text style={text}>
              Číslo objednávky je: <strong>#{orderId.slice(0, 8).toUpperCase()}</strong>
            </Text>

            <Section style={section}>
              <Heading style={sectionHeading}>Co se děje dál?</Heading>
              <Text style={text}>
                Zboží expedujeme po připsání platby na náš bankovní účet. Odeslali
                jsme Vám potvrzovací e-mail s údaji pro platbu.
              </Text>
              <Text style={text}>
                Bankovní účet: <strong>123456-0123456789/0300</strong>
              </Text>
              <Text style={text}>
                Variabilní symbol: <strong>2000544497</strong>
              </Text>
              <Text style={text}>
                Zpráva pro příjemce: <strong>Včelařské potřeby Bubeník</strong>
              </Text>
            </Section>

            <Section style={section}>
              <Heading style={sectionHeading}>Doručení</Heading>
              <Text style={text}>
                Zboží bude doručeno na adresu:
              </Text>
              <Text style={text}>{address}</Text>
              <Text style={text}>
                {postalCode} {city}
              </Text>
              <Text style={text}>
                Doručení obvykle do 2 pracovních dnů.
              </Text>
              {deliveryCost === 0 && (
                <Text style={infoText}>
                  Doprava je ZDARMA (hodnota objednávky nad 2 500 Kč)
                </Text>
              )}
              {deliveryCost > 0 && (
                <Text style={infoText}>Cena dopravy: {formatPrice(deliveryCost)}</Text>
              )}
            </Section>

            <Section style={section}>
              <Heading style={sectionHeading}>Objednané položky</Heading>
              {items.map((item, index) => (
                <div key={index} style={itemContainer}>
                  <Text style={itemText}>
                    {item.name} {item.size && `(${item.size})`} × {item.quantity} ks
                  </Text>
                  <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                </div>
              ))}
            </Section>

            <Section style={section}>
              <Heading style={sectionHeading}>Celková cena</Heading>
              <Text style={text}>Mezisoučet: {formatPrice(total - deliveryCost)}</Text>
              <Text style={text}>Doprava: {deliveryCost === 0 ? "ZDARMA" : formatPrice(deliveryCost)}</Text>
              <Text style={totalText} style={totalText}>
                Celkem k úhradě: {formatPrice(total)}
              </Text>
              <Text style={infoText}>
                Cena zahrnuje DPH 21%
              </Text>
            </Section>

            <Text style={footer}>
              Pokud máte jakékoliv dotazy, neváhejte nás kontaktovat na
              obchod@vcelarstvi-bubenik.cz
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  // PPL + COD
  if (deliveryMethod === "PPL" && paymentMethod === "CASH_ON_DELIVERY") {
    return (
      <Html>
        <Head />
        <Preview>Potvrzení objednávky #{orderId}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={heading}>Potvrzení objednávky</Heading>
            <Text style={text}>
              Dobrý den {customerName}, děkujeme za Vaši objednávku!
            </Text>
            <Text style={text}>
              Číslo objednávky je: <strong>#{orderId.slice(0, 8).toUpperCase()}</strong>
            </Text>

            <Section style={section}>
              <Heading style={sectionHeading}>Co se děje dál?</Heading>
              <Text style={text}>
                Zboží bude doručeno na Vaši adresu prostřednictvím přepravce PPL.
                Zaplatíte při převzetí zboží v hotovosti.
              </Text>
              <Text style={text}>
                Celková částka k úhradě: {formatPrice(total)}
              </Text>
              <Text style={infoText}>
                Příplatek za dobírku (100 Kč) je zahrnut v ceně.
              </Text>
            </Section>

            <Section style={section}>
              <Heading style={sectionHeading}>Doručovací adresa</Heading>
              <Text style={text}>{address}</Text>
              <Text style={text}>
                {postalCode} {city}
              </Text>
              <Text style={text}>
                Doručení obvykle do 2 pracovních dnů.
              </Text>
              {deliveryCost === 0 && (
                <Text style={infoText}>
                  Doprava je ZDARMA (hodnota objednávky nad 2 500 Kč)
                </Text>
              )}
            </Section>

            <Section style={section}>
              <Heading style={sectionHeading}>Objednané položky</Heading>
              {items.map((item, index) => (
                <div key={index} style={itemContainer}>
                  <Text style={itemText}>
                    {item.name} {item.size && `(${item.size})`} × {item.quantity} ks
                  </Text>
                  <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                </div>
              ))}
            </Section>

            <Section style={section}>
              <Heading style={sectionHeading}>Shrnutí ceny</Heading>
              <Text style={text}>Mezisoučet: {formatPrice(total - deliveryCost - codFee)}</Text>
              <Text style={text}>Doprava: {deliveryCost === 0 ? "ZDARMA" : formatPrice(deliveryCost)}</Text>
              <Text style={text}>Dobírka: {formatPrice(codFee)}</Text>
              <Text style={totalText} style={totalText}>
                Celkem k úhradě: {formatPrice(total)}
              </Text>
              <Text style={infoText}>
                Cena zahrnuje DPH 21%
              </Text>
            </Section>

            <Text style={footer}>
              Pokud máte jakékoliv dotazy, neváhejte nás kontaktovat na
              obchod@vcelarstvi-bubenik.cz
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  // Self-collection + Bank Transfer
  if (deliveryMethod === "SELF_COLLECTION" && paymentMethod === "BANK_TRANSFER") {
    return (
      <Html>
        <Head />
        <Preview>Potvrzení objednávky #{orderId}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={heading}>Potvrzení objednávky</Heading>
            <Text style={text}>
              Dobrý den {customerName}, děkujeme za Vaši objednávku!
            </Text>
            <Text style={text}>
              Číslo objednávky je: <strong>#{orderId.slice(0, 8).toUpperCase()}</strong>
            </Text>

            <Section style={section}>
              <Heading style={sectionHeading}>Co se děje dál?</Heading>
              <Text style={text}>
                Po obdržení této zprávy Vám zboží připravíme k vyzvednutí.
                Odesíláme Vám e-mail, že zboží je připraveno k vyzvednutí.
              </Text>
              <Text style={text}>
                <strong>Adresa pro vyzvednutí:</strong>
              </Text>
              <Text style={text}>Polní 46, 789 61 Bludov</Text>
              <Text style={text}>
                Zboží bude pro Vás rezervováno na 5 pracovních dnů.
              </Text>
            </Section>

            <Section style={section}>
              <Heading style={sectionHeading}>Platba</Heading>
              <Text style={text}>
                Platbu prosím uhraďte předem na náš bankovní účet:
              </Text>
              <Text style={text}>
                Bankovní účet: <strong>123456-0123456789/0300</strong>
              </Text>
              <Text style={text}>
                Variabilní symbol: <strong>2000544497</strong>
              </Text>
              <Text style={text}>
                Zpráva pro příjemce: <strong>Včelařské potřeby Bubeník</strong>
              </Text>
              <Text style={text}>
                Celkovou částku uhraďte do 10 dnů.
              </Text>
            </Section>

            <Section style={section}>
              <Heading style={sectionHeading}>Objednané položky</Heading>
              {items.map((item, index) => (
                <div key={index} style={itemContainer}>
                  <Text style={itemText}>
                    {item.name} {item.size && `(${item.size})`} × {item.quantity} ks
                  </Text>
                  <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                </div>
              ))}
            </Section>

            <Section style={section}>
              <Heading style={sectionHeading}>Celková cena</Heading>
              <Text style={totalText} style={totalText}>
                Celkem k úhradě: {formatPrice(total)}
              </Text>
              <Text style={infoText}>
                Osobní odběr je zdarma
              </Text>
              <Text style={infoText}>
                Cena zahrnuje DPH 21%
              </Text>
            </Section>

            <Text style={footer}>
              Pokud máte jakékoliv dotazy, neváhejte nás kontaktovat na
              obchod@vcelarstvi-bubenik.cz
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  // Self-collection + Cash in person
  if (deliveryMethod === "SELF_COLLECTION" && paymentMethod === "CASH_IN_PERSON") {
    return (
      <Html>
        <Head />
        <Preview>Potvrzení objednávky #{orderId}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={heading}>Potvrzení objednávky</Heading>
            <Text style={text}>
              Dobrý den {customerName}, děkujeme za Vaši objednávku!
            </Text>
            <Text style={text}>
              Číslo objednávky je: <strong>#{orderId.slice(0, 8).toUpperCase()}</strong>
            </Text>

            <Section style={section}>
              <Heading style={sectionHeading}>Co se děje dál?</Heading>
              <Text style={text}>
                Po obdržení této zprávy Vám zboží připravíme k vyzvednutí.
                Odesíláme Vám e-mail, že zboží je připraveno k vyzvednutí.
              </Text>
              <Text style={text}>
                <strong>Adresa pro vyzvednutí:</strong>
              </Text>
              <Text style={text}>Polní 46, 789 61 Bludov</Text>
              <Text style={text}>
                Platba v hotovosti při vyzvednutí.
              </Text>
              <Text style={text}>
                Zboží bude pro Vás rezervováno na 5 pracovních dnů.
              </Text>
            </Section>

            <Section style={section}>
              <Heading style={sectionHeading}>Objednané položky</Heading>
              {items.map((item, index) => (
                <div key={index} style={itemContainer}>
                  <Text style={itemText}>
                    {item.name} {item.size && `(${item.size})`} × {item.quantity} ks
                  </Text>
                  <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                </div>
              ))}
            </Section>

            <Section style={section}>
              <Heading style={sectionHeading}>Celková cena</Heading>
              <Text style={totalText} style={totalText}>
                Celkem k úhradě: {formatPrice(total)}
              </Text>
              <Text style={infoText}>
                Platba v hotovosti při vyzvednutí
              </Text>
              <Text style={infoText}>
                Osobní odběr je zdarma
              </Text>
              <Text style={infoText}>
                Cena zahrnuje DPH 21%
              </Text>
            </Section>

            <Text style={footer}>
              Pokud máte jakékoliv dotazy, neváhejte nás kontaktovat na
              obchod@vcelarstvi-bubenik.cz
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  // Default fallback
  return (
    <Html>
      <Head />
      <Preview>Potvrzení objednávky #{orderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Potvrzení objednávky</Heading>
          <Text style={text}>
            Dobrý den {customerName}, děkujeme za Vaši objednávku!
          </Text>
          <Text style={text}>
            Číslo objednávky je: <strong>#{orderId.slice(0, 8).toUpperCase()}</strong>
          </Text>

          <Text style={footer}>
            Pokud máte jakékoliv dotazy, neváhejte nás kontaktovat na
            obchod@vcelarstvi-bubenik.cz
          </Text>
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
  borderBottom: "1px solid #e5e5e5e5",
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

const infoText = {
  fontSize: "14px",
  color: "#6b7280",
  fontStyle: "italic",
};

const footer = {
  fontSize: "12px",
  color: "#6b7280",
  marginTop: "40px",
};
