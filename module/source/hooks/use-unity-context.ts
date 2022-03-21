import { useCallback, useEffect, useState } from "react";
import { IUnityConfig } from "../interfaces/unity-config";
import { IUnityContextHook } from "../interfaces/unity-context-hook";
import { IUnityProvider } from "../interfaces/unity-provider";
import { useNullableState } from "./use-nullable-state";

const useUnityContext = (unityConfig: IUnityConfig): IUnityContextHook => {
  const [unityInstance, setUnityInstance] = useNullableState<UnityInstance>();
  const [loadingProgression, setLoadingProgression] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialisationError, setInitialisationError] =
    useNullableState<Error>();

  /**
   * The Unity Context returns a Unity Provider instance. This is a statefull
   * object that contains a series of methods and properties that are used to
   * alter the Unity Context state.
   */
  const [unityProvider] = useState<IUnityProvider>({
    setLoadingProgression,
    setInitialisationError,
    setUnityInstance,
    setIsLoaded,
    unityConfig,
  });

  /**
   * Enables or disabled the Fullscreen mode of the Unity Instance.
   */
  const setFullscreen = useCallback(
    /**
     * @param enabled Defines whether Unity should be in fullscreen.
     */
    (enabled: boolean) => {
      // For undocumented reasons, the fullscreen mode can only be enabled
      // with an interger value where the value of "1" enables the fullscreen
      // mode and the value of "0" disables the fullscreen mode.
      unityInstance?.SetFullscreen(enabled === true ? 1 : 0);
    },
    [unityInstance]
  );

  /**
   * Sends a message to the UnityInstance to invoke a public method.
   */
  const sendMessage = useCallback(
    /**
     * @param gameObjectName the name of the game object in your Unity scene.
     * @param methodName the name of the public method on the game object.
     * @param parameter an optional parameter to pass along to the method.
     */
    (
      gameObjectName: string,
      methodName: string,
      parameter?: string | number | boolean
    ) => {
      unityInstance?.SendMessage(gameObjectName, methodName, parameter);
    },
    [unityInstance]
  );

  /**
   * Effect invoked when the loading progression changes. When the loading
   * progression is equal to or more than 1, the Unity Instance is considered
   * loaded. This will update the isLoaded state.
   */
  useEffect(() => {
    setIsLoaded(loadingProgression === 1);
  }, [loadingProgression]);

  /**
   * Returns the Unity Context Hook.
   */
  return {
    unityProvider,
    loadingProgression,
    initialisationError,
    isLoaded,
    setFullscreen,
    sendMessage,
  };
};

export { useUnityContext };