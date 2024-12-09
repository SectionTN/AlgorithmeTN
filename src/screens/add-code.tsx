import React, {useEffect, useState} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import BaseView from '../components/baseview/baseview.tsx';
import {
  Appbar,
  Button,
  Menu,
  Switch,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {FONTS} from '../config/misc.ts';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../config/navigation/types.ts';
import {ScrollView} from 'react-native-gesture-handler';
import SpacerV from '../components/spacer/spacerv.tsx';
import {fontValue, heightPercentageToDP} from '../config/dimensions.ts';
import {alert} from '@baronha/ting';
import {isEmpty, isEqual} from 'lodash';
import {customCapitalize} from '../utils/algo-utils.ts';
import {Language} from '../types/languages.ts';
import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import {useTranslation} from 'react-i18next';

const AddCode: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  const { t } = useTranslation();

  const sections = [
    {title: t('add-code.inf'), value: 'Science Informatique'},
    {title: t('add-code.sc'), value: 'Science Naturel'},
    {title: t('add-code.eco'), value: 'Économie & Gestion'},
  ];

  const languages: {title: string; value: Language; icon: string}[] = [
    {title: 'Algorithm', value: 'algorithm', icon: 'brain'},
    {title: 'Python', value: 'python', icon: 'language-python'},
    {title: 'JavaScript', value: 'javascript', icon: 'language-javascript'},
    {title: 'HTML5', value: 'html5', icon: 'language-html5'},
    {title: 'CSS3', value: 'css3', icon: 'language-css3'},
    {title: 'PHP', value: 'php', icon: 'language-php'},
    {title: 'SQL', value: 'sql', icon: 'code-tags'},
  ];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('');
  const [section, setSection] = useState('');
  const [language, setLanguage] = useState<
    | 'algorithm'
    | 'javascript'
    | 'python'
    | 'html5'
    | 'css3'
    | 'php'
    | 'sql'
    | 'none'
  >('none');
  const [instructions, setInstructions] = useState('');
  const [codeValue, setCodeValue] = useState('');

  const [levelMenuVisible, setLevelMenuVisible] = useState(false);
  const [sectionMenuVisible, setSectionMenuVisible] = useState(false);
  const [languageMenuVisible, setLanguageMenuVisible] = useState(false);

  const [isConnected, setIsConnected] = useState(true);

  const [switchToggled, setSwitchToggle] = React.useState(false);

  const route = useRoute<RouteProp<RootStackParamList, 'add-code'>>();
  const params = route.params;

  useEffect(() => {
    if (params?.codeValue) {
      setCodeValue(params?.codeValue);
    }
  }, [params?.codeValue]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (language !== 'none') {
      navigation.preload('write-code');
    }
  }, [language, navigation]);


  function handleButtonPress() {
    const titleLength = title.trim().length;
    const descriptionLength = description.trim().length;
    const uid = auth().currentUser?.uid;
    if (!isConnected) {
      return alert({
        title: 'Network Unavailable',
        message: 'Network connection is required',
        preset: 'error',
      });
    }
    if (isEmpty(title)) {
      return alert({
        title: 'Empty Title',
        message: 'Code title is required',
        preset: 'error',
      });
    }
    if (titleLength < 5) {
      return alert({
        title: 'Short Code Title',
        message: 'Title is too short',
        preset: 'error',
      });
    }
    if (isEmpty(description)) {
      return alert({
        title: 'Empty Description',
        message: 'Code description is required',
        preset: 'error',
      });
    }
    if (descriptionLength < 5) {
      return alert({
        title: 'Short Code Description',
        message: 'Description is too short',
        preset: 'error',
      });
    }
    if (!level) {
      return alert({
        title: 'Empty Level',
        message: 'School level is required',
        preset: 'error',
      });
    }
    if (level !== '1ére' && !section) {
      return alert({
        title: 'Empty Section',
        message: 'Level\'s section is required',
        preset: 'error',
      });
    }
    if (language === 'none') {
      return alert({
        title: 'Empty Language',
        message: 'Language selection is required',
        preset: 'error',
      });
    }
    if (!codeValue) {
      return alert({
        title: 'Empty Code',
        message: 'You must add some code',
        preset: 'error',
      });
    }
    if (switchToggled && !instructions) {
      return alert({
        title: 'Empty instructions',
        message: 'Add some instructions to your code',
        preset: 'error',
      });
    }
    alert({title: 'Please Wait', preset: 'spinner'});

    const newCode = {
      title,
      description,
      level,
      section,
      language,
      instructions,
      codeValue,
      uid,
      likes: [],
      views: [],
      createdAt: firestore.Timestamp.now(),
    };
    firestore()
      .collection('pending_codes')
      .add(newCode)
      .then(() => {
        alert({title: 'Sent for review', preset: 'done'});
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }).catch(error => {
      crashlytics().recordError(error);
      alert({title: 'Sending Failed', message: 'An error occurred'});
    });
  }

  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={true}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={t('add-code.add_code')}
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <SpacerV height={heightPercentageToDP(0.15)} />
      <ScrollView
        nestedScrollEnabled={true}
        alwaysBounceVertical={true}
        style={styles.scrollContainer}>
        <SpacerV height={heightPercentageToDP(0.25)} />
        <TextInput
          label={t('add-code.code_title')}
          value={title}
          mode={'outlined'}
          multiline={false}
          right={<TextInput.Affix text={`${title.length}/30`} />}
          onChangeText={text => {
            if (text.length > 30) {
              return;
            }
            setTitle(text);
          }}
        />
        <SpacerV height={heightPercentageToDP(0.25)} />
        <TextInput
          label={t('add-code.code_desc')}
          value={description}
          mode={'outlined'}
          multiline={true}
          right={<TextInput.Affix text={`${description.length}/100`} />}
          onChangeText={text => {
            if (text.length > 100) {
              return;
            }
            setDescription(text);
          }}
        />
        <SpacerV height={heightPercentageToDP(0.25)} />
        <Menu
          visible={levelMenuVisible}
          onDismiss={() => setLevelMenuVisible(false)}
          anchor={
            <Button onPress={() => setLevelMenuVisible(true)}>
              {level ? `${level} selected` : t('add-code.select_level')}
            </Button>
          }>
          <Menu.Item
            onPress={() => {
              setLevel('1ére');
              setLevelMenuVisible(false);
            }}
            title="1ére"
          />
          <Menu.Item
            onPress={() => {
              setLevel('2éme');
              setLevelMenuVisible(false);
            }}
            title="2éme"
          />
          <Menu.Item
            onPress={() => {
              setLevel('3éme');
              setLevelMenuVisible(false);
            }}
            title="3éme"
          />
          <Menu.Item
            onPress={() => {
              setLevel('BAC');
              setLevelMenuVisible(false);
            }}
            title="BAC"
          />
        </Menu>
        {level !== '1ére' && level !== '' && (
          <>
            <SpacerV height={heightPercentageToDP(0.25)} />
            <Menu
              visible={sectionMenuVisible}
              onDismiss={() => setSectionMenuVisible(false)}
              anchor={
                <Button onPress={() => setSectionMenuVisible(true)}>
                  {section ? `${section} selected` : t('add-code.select_section')}
                </Button>
              }>
              {sections.map(sec => (
                <Menu.Item
                  key={sec.value}
                  onPress={() => {
                    setSection(sec.value);
                    setSectionMenuVisible(false);
                  }}
                  title={sec.title}
                />
              ))}
            </Menu>
          </>
        )}
        <SpacerV height={heightPercentageToDP(0.25)} />
        <Menu
          visible={languageMenuVisible}
          onDismiss={() => setLanguageMenuVisible(false)}
          anchor={
            <Button onPress={() => setLanguageMenuVisible(true)}>
              {language !== 'none'
                ? `${customCapitalize(language)} selected`
                : t('add-code.select_language')}
            </Button>
          }>
          {languages.map(lang => (
            <Menu.Item
              key={lang.value}
              leadingIcon={lang.icon}
              onPress={() => {
                setLanguage(lang.value);
                setLanguageMenuVisible(false);
              }}
              title={lang.title}
            />
          ))}
        </Menu>
        <SpacerV height={heightPercentageToDP(0.25)} />
        <TextInput
          label={t('add-code.write_code')}
          mode={'outlined'}
          value={
            codeValue
              ? t('add-code.click_edit_code')
              : t('add-code.no_submit_code')
          }
          onFocus={() => {
            Keyboard.dismiss();
            if (isEqual(language, 'none')) {
              alert({
                title: t('add-code.language_not_select'),
                message: t('add-code.select_language_before'),
                preset: 'error',
              });
              return;
            }
            navigation.navigate('write-code', {
              language: language,
              codeValue: codeValue,
            });
          }}
          onBlur={() => Keyboard.dismiss}
        />
        <SpacerV height={heightPercentageToDP(0.25)} />
        <View style={styles.switchContainer}>
          <Text
            style={{
              fontFamily: FONTS.p_regular,
              fontSize: fontValue(16),
              flex: 1,
              paddingLeft: '1%',
            }}>
            Include Instructions
          </Text>
          <Switch
            value={switchToggled}
            onValueChange={() => setSwitchToggle(!switchToggled)}
          />
        </View>
        <SpacerV height={heightPercentageToDP(0.25)} />
        {switchToggled && (
          <TextInput
            label={t('add-code.write_instructions')}
            mode={'outlined'}
            value={instructions}
            right={<TextInput.Affix text={`${instructions.length}/750`} />}
            maxLength={775}
            onChangeText={text => {
              if (text.length > 750) {
                return;
              }
              setInstructions(text);
            }}
            multiline={instructions.length >= 25}
          />
        )}
        <SpacerV height={heightPercentageToDP(0.25)} />
        <View style={{flex: 1}}>{/*STUB VIEW*/}</View>
        <Button mode="contained-tonal" onPress={handleButtonPress}>
          Send for review
        </Button>
        <SpacerV height={heightPercentageToDP(0.1)} />
      </ScrollView>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  subtitleText: {
    fontSize: fontValue(15),
    fontFamily: FONTS.p_bold,
    opacity: 0.75,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    flex: 0,
    fontSize: fontValue(16),
    fontFamily: FONTS.p_regular,
    opacity: 0.75,
    width: '12.5%',
  },
  levelButton: {
    marginLeft: 10,
  },
});

export default AddCode;
