import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true    
        },
        password: {
            type: String,
            require: true
        }
    }
)

UserSchema.set('toJSON', {
    transform: function (doc, ret) {
      delete ret.password;
      return ret;
    }
  });

UserSchema.pre("save", function(next) {
    if (!this.isModified('password')) {
        next();
    }
    
    bcrypt.hash(this.password, 12)
        .then(hash => {
            this.password = hash;
            next();
        })
        .catch(err => {
            next(err);
        });
})

UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

export const userModel = mongoose.model("userModel", UserSchema);