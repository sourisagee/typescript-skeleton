import SignInForm from '../../features/SignInForm/SignInForm';
import type { UserAttributes } from '../../types/authTypes';

interface SignInPageProps {
  setUser: (user: UserAttributes | null) => void;
}

export default function SignInPage({ setUser }: SignInPageProps): React.JSX.Element {
  return (
    <>
      <SignInForm setUser={setUser} />
    </>
  );
}
