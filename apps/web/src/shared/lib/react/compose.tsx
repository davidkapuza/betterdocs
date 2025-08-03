import {
  ComponentType,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  Ref,
} from 'react';

type ComposedComponent<Props extends object> = ForwardRefExoticComponent<
  PropsWithoutRef<Props> & RefAttributes<unknown>
>;

export function compose<Props extends object>(
  ...hocs: Array<(component: ComponentType<Props>) => ComponentType<Props>>
): (component: ComponentType<Props>) => ComposedComponent<Props> {
  return (component: ComponentType<Props>) => {
    const Composed = hocs.reduceRight((wrapped, hoc) => hoc(wrapped), component);
    const WrappedComponent = forwardRef(
      (props: PropsWithoutRef<Props>, ref: Ref<unknown>) => {
        return <Composed {...(props as Props)} ref={ref} />;
      }
    );
    WrappedComponent.displayName = `Composed(${
      component.displayName || component.name || 'Component'
    })`;
    return WrappedComponent;
  };
}
