import VasturianoSunburst from '../../lib/components/visualizations/VasturianoSunburst.svelte';
import { generateSampleData, generateTaylorSwiftData } from '../../lib/utils/sunburstDataGenerator';

export default {
  title: 'Visualizations/VasturianoSunburst',
  component: VasturianoSunburst,
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    valueField: { control: 'text' },
    labelField: { control: 'text' },
    excludeRoot: { control: 'boolean' },
    transitionDuration: { control: 'number' },
    centerText: { control: 'text' }
  }
};

// Default template
const Template = (args) => ({
  Component: VasturianoSunburst,
  props: args
});

// Basic example
export const Default = Template.bind({});
Default.args = {
  data: {
    name: "root",
    children: [
      {
        name: "leafA",
        value: 3
      },
      {
        name: "nodeB",
        children: [
          {
            name: "leafBA",
            value: 5
          },
          {
            name: "leafBB",
            value: 1
          }
        ]
      }
    ]
  },
  width: '100%',
  height: '500px',
  valueField: 'value',
  labelField: 'name',
  excludeRoot: true,
  transitionDuration: 750,
  centerText: "Sunburst"
};

// Example with sample data
export const SampleData = Template.bind({});
SampleData.args = {
  data: generateSampleData(3, 4, 1, 10),
  width: '100%',
  height: '500px',
  valueField: 'value',
  labelField: 'name',
  excludeRoot: true,
  transitionDuration: 750,
  centerText: "User Preferences"
};

// Example with Taylor Swift themed data
export const TaylorSwiftData = Template.bind({});
TaylorSwiftData.args = {
  data: generateTaylorSwiftData(),
  width: '100%',
  height: '500px',
  valueField: 'value',
  labelField: 'name',
  excludeRoot: true,
  transitionDuration: 750,
  centerText: "Taylor Swift"
};

// Example with custom styling
export const CustomStyling = Template.bind({});
CustomStyling.args = {
  data: generateTaylorSwiftData(),
  width: '100%',
  height: '500px',
  valueField: 'value',
  labelField: 'name',
  excludeRoot: true,
  transitionDuration: 750,
  centerText: "Custom Styling"
};
