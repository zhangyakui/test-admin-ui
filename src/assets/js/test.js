



quickList = [
    {path: 'a', title: 'aaaa'},
    {path: 'b', title: 'bbbb'},
    {path: 'c', title: 'cccc'},
]

for (let i=0; i<quickList.length; i++){
    if (quickList[i].path == 'b'){
        quickList.splice(i, 1)
    }
}

console.log(quickList)
