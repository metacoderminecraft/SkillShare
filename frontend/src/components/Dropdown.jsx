import React, { useEffect, useState } from 'react'

const Dropdown = ({ renderOptions= () => "test", onChange= () => {}, className='', value='testing', name='' }) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (selected && !value) {
      onChange(React.Children.toArray(renderOptions())[0].props.children[0].props.value);
    }
  }, [selected])

  return (
    <select name={name} value={value} onChange={(e) => onChange(e.target.value)} onClick={() => setSelected(true)} className={className} >
        {!value && !selected && <option value="" disabled></option>}
        {renderOptions()}   
    </select>
  )
}

export default Dropdown