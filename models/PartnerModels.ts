export interface Partner {
  id: string | number;
  name: string;
  logo: string;
  code: string;
}

export interface Test {
  id: string | number;
  cover: string;
  title: string;
  time: number;
  about: string;
  instructions: string;
  organization: string;
  attempts: number;
  status: string;
  expires: string;
}
