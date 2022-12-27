import {Table} from "./table.js";

export function ServerSideTable({tableInstance, filterPlaceholder, readonlyMode, setSelected, setFetchPage, keyword, setKeyword}) {

  return <Table tableInstance={tableInstance}
                filterPlaceholder={filterPlaceholder}
                readonlyMode={readonlyMode}
                setSelected={setSelected}
                setFetchPage={setFetchPage}
                keyword={keyword}
                setKeyword={setKeyword}/>

}
