import React, {useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import BaseView from '../../components/baseview/baseview.tsx';
import {
  Appbar,
  Avatar,
  Card,
  Icon,
  IconButton,
  Searchbar,
  Text,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import {FlatGrid} from 'react-native-super-grid';
import {FONTS} from '../../config/misc.ts';
import SpacerH from '../../components/spacer/spacerh.tsx';
import {heightPercentageToDP, widthPercentageToDP} from '../../config/dimensions.ts';
import Animated, {SlideInLeft, SlideOutRight} from 'react-native-reanimated';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types.ts';

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="code-tags" />;

const Main: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');

  const windowWidth = Dimensions.get('window').width;

  const RightContent = (props: any) => (
    <>
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <IconButton
          {...props}
          icon="eye"
          iconColor={theme.colors.onPrimary}
          containerColor={theme.colors.primary}
          size={20}
          onPress={undefined}
        />
        <Text style={{fontFamily: FONTS.p_regular}} variant={'labelSmall'}>
          5, 294K
        </Text>
      </View>
      <SpacerH width={widthPercentageToDP(5)} />
    </>
  );

  const [items] = useState([
    {title: 'Bubble Sort', desc: 'Rayen Sbai'},
    {title: 'Quick Sort', desc: 'Lionel Messi'},
    {title: 'Fabonnaci', desc: '3M'},
    {title: 'Matrix Sort', desc: 'who'},
    {title: 'Maybe Dunno', desc: 'idk'},
    {title: 'GREEN SEA', desc: '#16a085'},
    {title: 'NEPHRITIS', desc: '#27ae60'},
    {title: 'BELIZE HOLE', desc: '#2980b9'},
    {title: 'WISTERIA', desc: '#8e44ad'},
    {title: 'MIDNIGHT BLUE', desc: '#2c3e50'},
    {title: 'SUN FLOWER', desc: '#f1c40f'},
    {title: 'CARROT', desc: '#e67e22'},
    {title: 'ALIZARIN', desc: '#e74c3c'},
    {title: 'CLOUDS', desc: '#ecf0f1'},
    {title: 'CONCRETE', desc: '#95a5a6'},
    {title: 'ORANGE', desc: '#f39c12'},
    {title: 'PUMPKIN', desc: '#d35400'},
    {title: 'POMEGRANATE', desc: '#c0392b'},
    {title: 'SILVER', desc: '#bdc3c7'},
    {title: 'ASBESTOS', desc: '#7f8c8d'},
  ]);

  const renderGridItem = ({item}) => {
    return (
      <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
      <Card
        mode={'contained'}
        onPress={() => {
          navigation.navigate('algo');
        }}>
        <Card.Title
          title={item.title}
          subtitle={item.desc}
          titleStyle={{fontFamily: FONTS.p_regular}}
          subtitleStyle={{fontFamily: FONTS.p_regular}}
          left={LeftContent}
          right={RightContent}
        />
        <Card.Content>
          <Text variant="bodyMedium">
            {'a basic sorting algorithm useful for easy purposes'}
          </Text>
          <SpacerV height={heightPercentageToDP(0.20)} />
          <Icon size={24} color={theme.colors.primary}  source={'language-javascript'} />
        </Card.Content>
        <Card.Actions>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <IconButton
              icon="heart"
              iconColor={theme.colors.onPrimary}
              containerColor={theme.colors.primary}
              size={20}
              onPress={() => {
                //alert({title: 'Bookmark saved', message: 'Take a look, you may found something else'});
              }}
            />
            <Text style={{fontFamily: FONTS.p_regular}} variant={'labelSmall'}>
              1, 2M
            </Text>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <IconButton
              icon="thought-bubble"
              iconColor={theme.colors.onPrimary}
              containerColor={theme.colors.primary}
              size={20}
              onPress={() => {
                //alert({title: 'Bookmark saved', message: 'Take a look, you may found something else'});
              }}
            />
            <Text style={{fontFamily: FONTS.p_regular}} variant={'labelSmall'}>
              1, 133K
            </Text>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <IconButton
              icon="bookmark"
              iconColor={theme.colors.onPrimary}
              containerColor={theme.colors.primary}
              size={20}
              onPress={() => {
                //alert({title: 'Bookmark saved', message: 'Take a look, you may found something else'});
              }}
            />
            <Text style={{fontFamily: FONTS.p_regular}} variant={'labelSmall'}>
              5, 294K
            </Text>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <IconButton
              icon="share"
              iconColor={theme.colors.onPrimary}
              containerColor={theme.colors.primary}
              size={20}
              onPress={() => {
                //alert({title: 'Bookmark saved', message: 'Take a look, you may found something else'});
              }}
            />
            <Text style={{fontFamily: FONTS.p_regular}} variant={'labelSmall'}>
              5, 294K
            </Text>
          </View>
        </Card.Actions>
      </Card>
      </Animated.View>
    );
  };

  return (
    <BaseView
      needsPaddingTop={false}
      avoidingView={false}
      needsPaddingBottom={false}>
      <Appbar.Header>
        <SpacerH width={widthPercentageToDP(0.5)} />
        {/* TODO: if user doesn't have a profile picture, show Text Avatar, else show his profile picture*/}
        <Avatar.Text label={'XD'} size={34} />
        <SpacerH width={widthPercentageToDP(0.5)} />
        <Appbar.Content
          title="Home"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
        <Tooltip title="Add">
          <Appbar.Action icon="pencil-plus" onPress={() => {}} />
        </Tooltip>
      </Appbar.Header>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={'Search'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatGrid
        itemDimension={windowWidth}
        data={items}
        style={styles.gridView}
        spacing={10}
        renderItem={renderGridItem}
      />
    </BaseView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingLeft: '3%',
    paddingRight: '3%',
  },
  gridView: {
    flex: 1,
    marginTop: '1%',
  },
  itemContainer: {
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    fontFamily: FONTS.p_regular,
  },
  itemCode: {
    fontFamily: FONTS.p_regular,
    fontSize: 12,
    opacity: 0.75,
  },
});

export default Main;
