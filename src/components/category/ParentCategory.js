import React from 'react';

import useAsync from '../../hooks/useAsync';
import CategoryServices from '../../services/CategoryServices';


const ParentCategory = () => {
  const { data } = useAsync(CategoryServices.getAllCategory); //   console.log(value);
  return (
    <>
       {/* {console.log('ctegory', parent)} */}
     {data?.map((parent,i) => (
     
        <option key={`${parent.id}` || i} value={parent.name}>
        {/* <option key={`${parent._id}-${parent.parent}`} value={parent.parent}> */}
          {parent?.name}
        </option>
      ))}
    </>
  );
};

export default ParentCategory;
