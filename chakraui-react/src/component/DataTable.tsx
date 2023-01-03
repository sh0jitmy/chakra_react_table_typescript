import React ,{useRef} from "react"


import { 
  useReactTable, 
  Sorting,
  Pagination, 
  Column,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  sortingFns,
  getSortedRowModel,
  FilterFn,
  SortingFn,
  ColumnDef,
  flexRender,
  FilterFns,
} from '@tanstack/react-table'

import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'



import { 
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td, 
  chakra,
  Flex,
  IconButton,
  Button,
  Text,
  Tooltip,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Spacer,
  Box,
} from "@chakra-ui/react";


import {
  TriangleDownIcon, 
  TriangleUpIcon,
  SearchIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  ChevronLeftIcon
} from "@chakra-ui/icons";

import { CSVLink } from "react-csv";

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}



//Chakra UI DataTable Function
function DataTable ({p_data,p_columns}:{p_data:any;p_columns:any;})  {
  //transform memo
  const data = React.useMemo(() =>p_data,[])
  const columns = React.useMemo(() => p_columns,[])
  const csvLink = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null); 
 
  //display default
  const defaultValue = 10;// display num def
  const pageEntries = [10, 20, 30, 40, 50];//select display num
  
  const [globalFilter, setGlobalFilter] = React.useState('')

  //react-table hooks
    const reactTable = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })



  const getTransactionData = async() => {
   csvLink?.current?.link.click();
  }


  // render 
  return (
   <div>
   {/* debugs  */}
   {/*
     <pre>
       <code>
         {JSON.stringify(
           {
             pageIndex,
             pageSize,
             pageCount,
             canNextPage,
             canPreviousPage
           },
           null,
           2
         )}
       </code>
     </pre>
    */}
    {/* global filter(search) fields  */}
    <Flex alignItems="right">
      <Spacer /> 
      <InputGroup width={200}> 
        <InputRightElement
          pointerEvents='none'
          children={<SearchIcon color='gray.300' />}
        />
        <Input
         type="text"
         variant="filled"
         placeholder="search"
         value={globalFilter || ""}
         onChange={e => setGlobalFilter(e.target.value)}
     />
      </InputGroup> 
    </Flex>

    {/* table contents  */}
    <Table >
      <Thead>
        {reactTable.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Th
                key={header.id} colSpan={header.colSpan}
              >
                <div
                   {...{
                     className: header.column.getCanSort()
                     ? 'cursor-pointer select-none'
                     : '',
                     onClick: header.column.getToggleSortingHandler(),
                   }}
                 >
                  {flexRender(header.column.columnDef.header,header.getContext())}
                  <chakra.span pl='4'>
                    {[header.column.getIsSorted () as string] ? (
                      'asc' ? (
                        <TriangleDownIcon aria-label='sorted descending' />
                      ) : (
                        <TriangleUpIcon aria-label='sorted ascending' />
                      )
                    ) : null}
                  </chakra.span>
                </div>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead> 
      <Tbody>
        {reactTable.getRowModel().rows.map(row => {
          return (
            <Tr key={row.id}>
              {row.getVisibleCells().map(cell => {
                return (
                  <Td key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </Td>
                )
              })}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
    
    {/* pagination control  */}
    <Flex justifyContent="space-between" m={4} alignItems="center">
        {/* previous button  */}
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              aria-label="First Page"
              onClick={() => reactTable.setPageIndex(0)}
              isDisabled={!reactTable.getCanPreviousPage()}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              aria-label="Prev Page"
              onClick={() => reactTable.previousPage()}
              isDisabled={!reactTable.getCanPreviousPage()}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>
        {/* center text & input/select   */}
        <Flex alignItems="center">
          <Text flexShrink="0" mr={8}>
            ページ{" "}
            <Text fontWeight="bold" as="span">
              {reactTable.getState().pagination.pageIndex + 1}
            </Text>{" "}
            /{" "}
            <Text fontWeight="bold" as="span">
              {reactTable.getPageCount()}
              {/*{pageOptions.length}*/}
            </Text>
          </Text>
          <Text flexShrink="0">ページ表示:</Text>{" "}
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={reactTable.getPageCount()}
            onChange={(value) => {
              const page = value ? Number(value) - 1 : 0;
              reactTable.setPageIndex(page);
            }}
            defaultValue={reactTable.getState().pagination.pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={reactTable.getState().pagination.pageSize}
            onChange={(e) => {
              reactTable.setPageSize(Number(e.target.value));
            }}
          >
            {pageEntries.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} 件表示
              </option>
            ))}
          </Select>
          {/* CSV Output*/}
          <Button
            onClick={getTransactionData}
            leftIcon={<DownloadIcon h={6} w={6} />}
            ml={8}
          > Download </Button>
          <CSVLink
           data={data}
           filename='transactions.csv'
           className='hidden'
           ref={csvLink}
           target='_blank'
          />
        </Flex>
        {/* next button  */}
        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              aria-label="Next Page"
              onClick={() => reactTable.nextPage()}
              isDisabled={!reactTable.getCanNextPage()}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              aria-label="Last Page"
              onClick={() => reactTable.setPageIndex(reactTable.getPageCount() - 1)}
              isDisabled={!reactTable.getCanNextPage()}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
            />
          </Tooltip>
        </Flex>
      </Flex>
   </div>
  )
}

export default DataTable
