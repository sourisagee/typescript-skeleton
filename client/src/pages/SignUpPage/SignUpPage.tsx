import type React from 'react';
import SignUpForm from '../../features/SignUpForm/SignUpForm';
import type { UserAttributes } from '../../types/authTypes';

interface SignUpPageProps {
  setUser: (user: UserAttributes | null) => void;
}

export default function SignUpPage({ setUser }: SignUpPageProps): React.JSX.Element {
  return (
    <>
      <SignUpForm setUser={setUser} />
    </>
  );
}
