import ResetPassword from "./reset-password";

const ResetPasswordPage = ({ params }: { params: { token: string } }) => {
  return <ResetPassword paramsData={params}></ResetPassword>;
};

export default ResetPasswordPage;

export async function generateStaticParams() {
  return [{ token: "1" }, { token: "2" }, { token: "3" }];
}
