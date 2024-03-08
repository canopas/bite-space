import InvitedMember from "./edit";

const EditInvitedMemberPage = ({ params }: { params: { id: number } }) => {
  return <InvitedMember paramsData={params}></InvitedMember>;
};

export default EditInvitedMemberPage;

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
