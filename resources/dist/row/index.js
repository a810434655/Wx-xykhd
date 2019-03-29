Component({
    externalClasses: ['i-class'],
  properties: {
    background: {
      type: String,
      value: 'transparent'
    }
  },
    relations: {
        '../col/index': {
            type: 'child'
        }
    }
});
