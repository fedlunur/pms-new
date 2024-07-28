
export class TaskCardAttachmentService {



     getTaskCardAttachment() {
        return fetch('data/products.json').then(res => res.json()).then(d => d.data);
    }

  
}
    