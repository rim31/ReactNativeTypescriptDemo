import Environment from '../../../Environment';

export default function CheckToken(jwt: string): any {
  try {
    return fetch(`${Environment.BASE_URL}profile`, {
      method: "GET",
      headers: { "Content-type": "application/json", "auth_token": jwt }
    }).then((response: any) => response.json())
      .catch((err: any) => {
        alert('need login again');
        return;
      })
  } catch (err) {
    console.log(err)
    return;
  }
}