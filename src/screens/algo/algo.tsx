import BaseView from '../../components/baseview/baseview.tsx';
import {Appbar, BottomNavigation, Tooltip, useTheme} from 'react-native-paper';
import {FONTS} from '../../config/misc.ts';
import React, {useCallback, useEffect} from 'react';
import {RouteProp, useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types.ts';
import Code from './code.tsx';
import Instructions from './instructions.tsx';
import {BackHandler, StatusBar} from 'react-native';
import {useTranslation} from 'react-i18next';

const Algo: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  const [index, setIndex] = React.useState(0);

  const { t } = useTranslation();

  const navRoute = useRoute<RouteProp<RootStackParamList, 'algo'>>();
  const {codeId} = navRoute.params!;

  const [routes] = React.useState([
    {
      key: 'code',
      title: 'Code',
      focusedIcon: 'code-tags',
    },
    {
      key: 'instructions',
      title: t('instructions.title'),
      focusedIcon: 'file-outline',
    },
  ]);

  const renderScene = ({route}: {route: {key: string}}) => {
    switch (route.key) {
      case 'code':
        return <Code codeId={codeId ?? ''} />;
      case 'instructions':
        return <Instructions codeId={codeId ?? ''} />;
      default:
        return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.elevation.level2);
  }, [theme.colors.elevation.level2]);

  const getHeaderTitle = () => {
    switch (index) {
      case 0:
        return t('code.title');
      case 1:
        return t('instructions.title');
      default:
        return t('home.title');
    }
  };

  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <Appbar.BackAction onPress={() => navigation.popTo('home')} />
        <Appbar.Content
          title={getHeaderTitle()}
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
        {false && (
          <>
            <Tooltip title="Like">
              <Appbar.Action icon="heart-outline" onPress={() => {}} />
            </Tooltip>
            <Tooltip title="Bookmark">
              <Appbar.Action icon="bookmark-outline" onPress={() => {}} />
            </Tooltip>
            <Tooltip title="Share">
              <Appbar.Action icon="share-outline" onPress={() => {}} />
            </Tooltip>
          </>
        )}
      </Appbar.Header>
      <BottomNavigation
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </BaseView>
  );
};

export default Algo;
