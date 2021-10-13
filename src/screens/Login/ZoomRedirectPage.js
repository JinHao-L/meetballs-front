import { useLocation } from 'react-router';

const PARAM_KEY = 'code';

export default function ZoomRedirectPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const authCode = params.get(PARAM_KEY);

  return (
    <div>
      <h>Hello world! {authCode}</h>
    </div>
  );
}
