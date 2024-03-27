export default function ForgotPasswordEmail(link: string) {
  return (
    <div>
      <div style={main}>
        <div style={container}>
          <div style={heading}>
            <span style={headingSpan}>Bite</span> Space
          </div>
          <div style={subTitle}>
            <p>Elevate your dining experience with every bite.</p>
            <p>
              Where passion meets the palate – Welcome to a world of culinary
              delight!
            </p>
          </div>
          <div style={hr} />
          <p style={mainParagraph}>
            We received a request to reset your password. If you did not request
            a password reset, please ignore this email or contact support.
          </p>
          <div style={hr} />
          <p style={paragraph}>
            Click the button below to set new password for your account.
          </p>
          <div style={linkDiv}>
            <a href={link} style={button}>
              Reset Password
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const main = {
  background: "white",
  fontFamily: "sans",
  padding: "5rem",
};

const container = {
  margin: "0 auto",
  "text-align": "center",
  maxWidth: "50rem",
};

const heading = {
  fontSize: "50px",
  fontWeight: "900",
  color: "#ff6347",
};

const headingSpan = {
  fontWeight: "900",
  color: "black",
};

const subTitle = {
  color: "#484848",
  fontSize: "13px",
  marginBottom: "2rem",
};

const mainParagraph = {
  marginTop: "5rem",
  marginBottom: "5rem",
  fontSize: "20px",
  lineHeight: "2.4",
  color: "#69696a",
};

const black = {
  color: "black",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "5",
  color: "#484848",
  marginBottom: "20px",
};

const linkDiv = {
  display: "inline-block",
};

const button = {
  fontSize: "16px",
  borderRadius: "15px",
  background: "#ff6347",
  border: "none",
  color: "white",
  textDecoration: "none",
  padding: "0.75rem 3.5rem",
};

const hr = {
  borderTop: "1px solid #d7d7d8",
};
