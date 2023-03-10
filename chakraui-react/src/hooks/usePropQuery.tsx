import axios from 'axios';
import {AxiosError} from 'axios';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import {PropType} from '../types/PropType'



const GET_URL = "http://localhost:58080/property";

const proptable : PropType[]  = [
 {Name:"Name1",ID:"ID1",Value:"Value1",Updateat:"2022/08/13 00:00:00"},
 {Name:"Name2",ID:"ID2",Value:"Value2",Updateat:"2022/08/13 00:00:00"},
 {Name:"Name3",ID:"ID3",Value:"Value3",Updateat:"2022/08/13 00:00:00"},
 {Name:"Name4",ID:"ID4",Value:"Value4",Updateat:"2022/08/13 00:00:00"},
 {Name:"Name5",ID:"ID5",Value:"Value5",Updateat:"2022/08/13 00:00:00"},
 {Name:"Name6",ID:"ID6",Value:"Value6",Updateat:"2022/08/13 00:00:00"},
 {Name:"Name7",ID:"ID7",Value:"Value7",Updateat:"2022/08/13 00:00:00"},
 {Name:"Name8",ID:"ID8",Value:"Value8",Updateat:"2022/08/13 00:00:00"},
 {Name:"Name9",ID:"ID9",Value:"Value9",Updateat:"2022/08/13 00:00:00"},
 {Name:"Name10",ID:"ID10",Value:"Value10",Updateat:"2022/08/13 00:00:00"},
 {Name:"Name11",ID:"ID11",Value:"Value11",Updateat:"2022/08/13 00:00:00"},
];


export const usePropQuery = ()  => {
  const result = useQuery<PropType[]>(["proplist"],getPropList);
  return result 
};

const getPropList = async(): Promise<PropType[]> => {
  try {
    const res = await axios.get<PropType[]>(GET_URL);
    console.log(res)
    return res.data
  } catch (error) {
   console.error(error);
  }
  return []
}

