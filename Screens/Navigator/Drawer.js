import 'react-native-gesture-handler';
import {createDrawerNavigator} from '@react-navigation/drawer';
import IndexScreen from './IndexDrawer';
import MeScreen from '../Me';
import CustomContent from './DrawerCustomContent';
import ContactScreen from '../Contact';
const Drawer = createDrawerNavigator();

export default function Home() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomContent {...props} />}>
      <Drawer.Screen name="Index" component={IndexScreen} />
      <Drawer.Screen name="Profile" component={MeScreen} />
      <Drawer.Screen name="Contact" component={ContactScreen} />
    </Drawer.Navigator>
  );
}
