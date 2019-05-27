import React from 'react';
import compose from '@shopify/react-compose';
import isObjectsEqual from '../../utilities/isObjectsEqual';
import {ContextualSaveBarProps, FrameContextType, FrameContext} from '../Frame';
import withContext from '../WithContext';
import {WithContextTypes} from '../../types';
import {withAppProvider, WithAppProviderProps} from '../AppProvider';

// The script in the styleguide that generates the Props Explorer data expects
// a component's props to be found in the Props interface. This silly workaround
// ensures that the Props Explorer table is generated correctly, instead of
// crashing if we write `ContextualSaveBar extends React.Component<ContextualSaveBarProps>`
interface Props extends ContextualSaveBarProps {}
export type ComposedProps = Props &
  WithAppProviderProps &
  WithContextTypes<FrameContextType>;

class ContextualSaveBar extends React.PureComponent<ComposedProps, never> {
  componentDidMount() {
    const {
      props: {polaris, context, ...rest},
    } = this;
    context.setContextualSaveBar(rest);
  }

  componentWillUnmount() {
    this.props.context.removeContextualSaveBar();
  }

  componentDidUpdate(oldProps: ComposedProps) {
    const {
      props: {polaris, context, ...rest},
    } = this;
    if (contextualSaveBarHasChanged(rest, oldProps)) {
      context.setContextualSaveBar(rest);
    }
  }

  render() {
    return null;
  }
}

function contextualSaveBarHasChanged(
  {message, saveAction, discardAction}: Props,
  {
    message: oldMessage,
    saveAction: oldsaveAction,
    discardAction: oldDiscardAction,
  }: Props,
) {
  return Boolean(
    message !== oldMessage ||
      !isObjectsEqual(saveAction, oldsaveAction) ||
      !isObjectsEqual(discardAction, oldDiscardAction),
  );
}

export default compose<Props>(
  withContext<Props, WithAppProviderProps, FrameContextType>(
    FrameContext.Consumer,
  ),
  withAppProvider(),
)(ContextualSaveBar);
