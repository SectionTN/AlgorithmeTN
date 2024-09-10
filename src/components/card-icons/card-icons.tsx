import React from 'react';
import { Avatar } from 'react-native-paper';

type LeftComponentProps = {
  size: number;
};

const DarkModeIcon = ({ size }: LeftComponentProps) => (
  <Avatar.Icon size={size} icon="weather-night" />
);
const LanguageIcon = ({ size }: LeftComponentProps) => (
  <Avatar.Icon size={size} icon="translate" />
);
const EditNameIcon = ({ size }: LeftComponentProps) => (
  <Avatar.Icon size={size} icon="pencil-outline" />
);
const LogOutIcon = ({ size }: LeftComponentProps) => (
  <Avatar.Icon size={size} icon="logout" />
);
const ShieldIcon = ({ size }: LeftComponentProps) => (
  <Avatar.Icon size={size} icon="shield-outline" />
);
const AtIcon = ({ size }: LeftComponentProps) => (
  <Avatar.Icon size={size} icon="at" />
);
const ActiveIcon = ({ size }: LeftComponentProps) => (
  <Avatar.Icon size={size} icon="resistor" />
);
const BugReportIcon = ({ size }: LeftComponentProps) => (
  <Avatar.Icon size={size} icon="bug-outline" />
);
const HelpIcon = ({ size }: LeftComponentProps) => (
  <Avatar.Icon size={size} icon="help-circle-outline" />
);
const HandshakeIcon = ({ size }: LeftComponentProps) => (
  <Avatar.Icon size={size} icon="handshake-outline" />
);

export {
  DarkModeIcon,
  EditNameIcon,
  LogOutIcon,
  ShieldIcon,
  AtIcon,
  ActiveIcon,
  BugReportIcon,
  HelpIcon,
  HandshakeIcon,
  LanguageIcon,
};
