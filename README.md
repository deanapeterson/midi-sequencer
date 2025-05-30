# Sequencer

## About this Project

This is my attempt at creating a effective midi sequencer using Web Technology.
My reasons for doing this are:
1. Learning: I want to understand the MIDI protocol better and how it works with it using the web technology.
2. Scratch an itch:  One of my favorite open source sequencers is stochas.  It's great for free but it, IMHO, has significant usability issues.
3. My GitHub repos are kind of old.  Just keeping it real.

## Roadmap (Tentative)

- Working MVP/POC (should be there soon)
  - able to add/remove notes on a grid
  - be able to press play/stop and hear notes coming from a running synth on my desktop
- Accurate time clock capability (Deal breaker)
  - DOM.setTimeout() is not ideal
  - Options Include: using the AudioApi, requestAnimationFrame, and other. Research needed.
- Build additional features
  - Drag to change note length
  - Randomization of selected notes. (Like Stochas)
  - Persist prefered ports
  - local storage of current sequence data
  - Multiple Layers and patterns per layer.(Like Stochas)
  - Lot's of things.
- Possible other features:
  - Midi file import/export
  - use browser native sound generation


------
------


This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.12.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
