import { ApplicationRef, Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injector, OnInit } from '@angular/core';


//Before using in a component - add to its constructor: private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector
//Usage: create and instance of a desired component (with any desired values), then use appendComponentToBody(this, <ComponentClass>, <componentInstance>, <parentHTMLElement>)

export function appendComponentToBody(ths: any, component: any, componentInstance: any, htmlElem: HTMLElement) {
    // 1. Create a component reference from the component 
    const componentRef = ths.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(ths.injector);

    Object.assign(componentRef.instance, componentInstance);

    // 2. Attach component to the appRef so that it's inside the ng component tree
    ths.appRef.attachView(componentRef.hostView);
    
    // 3. Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    
    // 4. Append DOM element to the body
    //ths.document.body.appendChild(domElem);
    htmlElem.appendChild(domElem);
    
    // 5. Wait some time and remove it from the component tree and from the DOM
    // setTimeout(() => {
    //     this.appRef.detachView(componentRef.hostView);
    //     componentRef.destroy();
    // }, 3000);
    return domElem;
  }