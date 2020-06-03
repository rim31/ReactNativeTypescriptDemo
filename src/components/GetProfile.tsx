import * as React from 'react'
import Environment from '../../Environment';

export default function GetProfile({ token }) {
  const [response, setResponse] = React.useState<Object>({})
  async (): Promise<void> => {
    try {
      const response: Response = await fetch(`${BASE_URL}profile`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "auth_token": token
        }
      });
      const res: string = await response.json();
      if (response.status === 200) {
        setResponse(res)
      } else {
        alert('Error :-/ get Profile')
      }
      if (res.length === 0)
        setResponse({})
    } catch (err) {
      alert(err);
      setResponse({})
    }
  }

  React.useEffect(() => {
  }, []);

  return (response)
}
