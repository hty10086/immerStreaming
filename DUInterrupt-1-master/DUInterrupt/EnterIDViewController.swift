//
//  EnterIDViewController.swift
//  DUInterrupt
//
//  Created by 胡天运 on 2021/7/15.
//  Copyright © 2021 Aditya Bose. All rights reserved.
//

import UIKit

class EnterIDViewController: UIViewController {

    
   
    
    @IBOutlet weak var textF: UITextField!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    @IBAction func dismissKeyboard(_ sender: Any) {
    }
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "segue1"{
            let destinationController = segue.destination as! ViewController
            destinationController.partiID = self.textF.text!
        }
    }
    

}
