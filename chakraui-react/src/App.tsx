import { ChakraProvider, Flex, Heading, Text, Icon } from '@chakra-ui/react'
import React,{ useEffect, useRef, useState } from 'react'
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { createColumnHelper } from "@tanstack/react-table";


import DataTable from './component/DataTable'
import { PropType}  from './types/PropType'
import { usePropQuery } from "./hooks/usePropQuery"



const PropListTable = ()=>{
  //const columns = React.useMemo(
  // () => [
  {/*
  const columns = [
    {
      Header: '設定項目',
      accessor: 'Name',
    },
    {
      Header: 'ID',
      accessor: 'ID',
    },
    {
      Header: '現在の設定',
      accessor: 'Value',
    },
    {
      Header: '更新時刻',
      accessor: 'Updateat',
    },
  ]*/}
  const columnHelper = createColumnHelper<PropType>()
 
  const columns = [
    columnHelper.accessor('Name',{
      header: () => '設定項目',
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('ID',{
      header: () => 'ID',
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('Value',{
      header: () => '現在の設定',
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('Updateat',{
      header: () => '更新時刻',
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),

  ]
  //const [data , isLoding,error] = usePropQuery()
  const {data,isLoading,error} = usePropQuery();
  if (isLoading || !data) {
    return <div>Loading...</div>
  }
  return (
      <DataTable p_data={data} p_columns={columns} />
  )
}




function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Flex direction="column" p={10}>
          <Heading mb={4}>React ChakraUI Table</Heading>
          <PropListTable />
        </Flex>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App;
