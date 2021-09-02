




list = [26, 33, 35]
list2 = [1, 2, 7, 11, 15, 16, 21, 26, 27, 30, 33 ]
_list = []
list.forEach(num => {
    if (list2.indexOf(num) == -1){
        _list.push(num)
    }
})

console.log(_list)

