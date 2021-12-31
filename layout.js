import { move } from 'react-native-redash'
const isNotInword = offset => {
  'worklet';
  return offset.order.value !== -1;
};

const byOrder = (a, b) => {
  'worklet';
  return a.order.value > b.order.value ? 1 : -1;
};


export const reorder = (offets, from, to)=>{
    "worklet";
    const offsets = offets.filter(isNotInword).sort(byOrder);
    const newOffsets = move(offsets, from, to);
    newOffsets.map((offset,index)=>(offsets.order.value = index));
}
export const CalculateLayout = (offset = [], containerWidth) => {
    'worklet';
  const offsets = offset.filter(isNotInword).sort(byOrder);
  if (offsets.length === 0) {
    return;
  }
  const height = offsets[0].height.value;
  let lineNumber = 0;
  let lineBreak = 0;
  
  offsets.forEach((offset, index) => {
      
    const total = offsets
      .slice(lineBreak, index)
      .reduce((acc, o) => acc + o.width.value, 0);
        if(total + offset.width.value > containerWidth){
           lineNumber += 1;
           lineBreak = index;
           offset.x.value = 0
        }else {
            offset.x.value = total
        }
        offset.y.value = height * lineNumber
  });
  
};
