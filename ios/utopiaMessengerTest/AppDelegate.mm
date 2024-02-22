#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/CoreModulesPlugins.h>
#import <ReactCommon/RCTTurboModuleManager.h>
#import <facebook/react/NativeUtopiaManager.h>
#import <facebook/react/NativeUtopiaModule.h>
#import <facebook/react/NativeUtopiaUtils.h>

@interface AppDelegate () <RCTTurboModuleManagerDelegate> {}
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"react_native_utopia_app";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end

#pragma mark RCTTurboModuleManagerDelegate

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                      jsInvoker:(std::shared_ptr<facebook::react::CallInvoker>)jsInvoker
{
  if (name == "NativeUtopiaUtils") {
    return std::make_shared<facebook::react::NativeSampleModule>(jsInvoker);
  }
  if (name == "NativeUtopiaModule") {
    return std::make_shared<facebook::react::NativeSampleModule>(jsInvoker);
  }
  if (name == "NativeUtopiaManager") {
    return std::make_shared<facebook::react::NativeSampleUtils>(jsInvoker);
  }
  return nullptr;
}