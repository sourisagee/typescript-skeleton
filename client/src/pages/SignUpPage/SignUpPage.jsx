import SignUpForm from '../../features/SignUpForm/SignUpForm';

export default function SignUpPage({ setUser }) {
  return (
    <>
      <SignUpForm setUser={setUser} />
    </>
  );
}
