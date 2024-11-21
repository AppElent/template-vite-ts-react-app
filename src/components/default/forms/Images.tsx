import { FieldConfig } from '@/libs/forms';
import useFormField from '@/libs/forms/use-form-field';

import _ from 'lodash';

interface ImagesProps {
  name: string;
  field?: FieldConfig;
}

// TODO: Implement this feature

const Images = ({ name, field: fieldConfig, ...props }: ImagesProps) => {
  const fieldName = fieldConfig ? fieldConfig.name : name;
  const data = useFormField(fieldName, fieldConfig);
  const { options } = data;

  const newProps = _.merge({}, options, props);
  console.log(newProps);
  return (
    <div>
      <h1>Images</h1>
    </div>
  );
};

export default Images;
